import { LogLevel } from "../../../../../Packages/CustomLogger/CustomLogger";
import { CustomLogManager } from "../../../../../Packages/CustomLogger/CustomLogManager";
import { Difficulty } from "../../../Layer1/Difficulty";
import { BulkReportTableContainer } from "../../Report/BulkReport/BulkReportTableContainer";
import { BulkReportTableReader } from "../../Report/BulkReport/BulkReportTableReader";
import { GoogleFormReport } from "../../Report/GoogleFormReport";
import { IMusicDataReport } from "../../Report/IMusicDataReport";
import { IReport } from "../../Report/IReport";
import { GoogleFormLevelBulkReport } from "../../Report/LevelBulkReport/GoogleFormLevelBulkReport";
import { LevelBulkReport } from "../../Report/LevelBulkReport/LevelBulkReport";
import { LevelBulkReportSheet } from "../../Report/LevelBulkReport/LevelBulkReportSheet";
import { MusicDataReportGroupContainer } from "../../Report/MusicDataReportGroupContainer";
import { ReportStatus } from "../../Report/ReportStatus";
import { PostLocation, ReportStorage } from "../../Report/ReportStorage";
import { Utility } from "../../Utility";
import { ReportFormModule } from "../@ReportFormModule";
import { LINEModule } from "../LINEModule";
import { MusicModule } from "../MusicModule";
import { VersionModule } from "../VersionModule";
import { LevelBulkReportGoogleForm } from "./LevelBulkReportGoogleForm";
import { ReportGoogleForm } from "./ReportGoogleForm";
import { Music } from "../../Music/Music";

export class ReportModule extends ReportFormModule {
    public static readonly moduleName = 'report';

    private get lineModule(): LINEModule { return this.getModule(LINEModule); }
    private get musicModule(): MusicModule { return this.getModule(MusicModule); }
    private get versionModule(): VersionModule { return this.getModule(VersionModule); }
    private get reportModule(): ReportModule { return this.getModule(ReportModule); }

    private readonly _reportGoogleForm = new ReportGoogleForm(this);
    private readonly _levelBulkReportGoogleForm = new LevelBulkReportGoogleForm(this);
    private readonly _levelBulkReportSheetMap: { [key: string]: LevelBulkReportSheet } = {};

    public get reportGoogleForm(): GoogleAppsScript.Forms.Form {
        return this._reportGoogleForm.form;
    }

    public get levelBulkReportGoogleForm(): GoogleAppsScript.Forms.Form {
        return this._levelBulkReportGoogleForm.form;
    }

    public noticeReportPost(message: string): void {
        if (this.configuration.runtime.lineNoticeUnitReportEnabled) {
            this.lineModule.pushNoticeMessage([message]);
        }
    }

    private readonly _reportStorage: { [key: string]: ReportStorage } = {};
    public getReportStorage(versionName: string): ReportStorage {
        if (versionName in this._reportStorage) {
            return this._reportStorage[versionName];
        }
        this._reportStorage[versionName] = new ReportStorage(
            this.musicModule.getSpecifiedVersionRepository(versionName),
            this.versionModule.getVersionConfig(versionName).reportSpreadsheetId,
            this.versionModule.getVersionConfig(versionName).reportWorksheetName);
        return this._reportStorage[versionName];
    }

    public getReports(versionName: string): IReport[] {
        return this.getReportStorage(versionName).reports;
    }

    public getReport(versionName: string, reportId: number): IReport {
        return this.getReportStorage(versionName).getReportById(reportId);
    }

    private readonly _musicDataReportGroupContainer: { [key: string]: MusicDataReportGroupContainer } = {};
    public getMusicDataReportGroupContainer(versionName: string): MusicDataReportGroupContainer {
        if (versionName in this._musicDataReportGroupContainer) {
            return this._musicDataReportGroupContainer[versionName];
        }

        const versionConfig = this.versionModule.getVersionConfig(versionName);
        const sheet = SpreadsheetApp
            .openById(versionConfig.reportSpreadsheetId)
            .getSheetByName(versionConfig.reportGroupWorksheetName);
        const storage = this.getReportStorage(versionName);
        const container = MusicDataReportGroupContainer.createByStorage(sheet, storage);

        this._musicDataReportGroupContainer[versionName] = container;
        return container;
    }

    public getLevelBulkReportSheet(versionName: string): LevelBulkReportSheet {
        if (versionName in this._levelBulkReportSheetMap) {
            return this._levelBulkReportSheetMap[versionName];
        }
        this._levelBulkReportSheetMap[versionName] = new LevelBulkReportSheet(
            this.musicModule.getSpecifiedVersionRepository(versionName),
            this.versionModule.getVersionConfig(versionName).reportSpreadsheetId,
            this.versionModule.getVersionConfig(versionName).bulkReportWorksheetName);
        return this._levelBulkReportSheetMap[versionName];
    }

    public getLevelBulkReports(versionName: string): LevelBulkReport[] {
        return this.getLevelBulkReportSheet(versionName).bulkReports;
    }

    public approve(versionName: string, reportId: number): void {
        const reportStorage = this.getReportStorage(versionName);
        const targetReport = reportStorage.getReportById(reportId);
        const duplicatedReports = reportStorage.reports.filter(r =>
            r.reportId !== targetReport.reportId && r.musicId === targetReport.musicId && r.difficulty === targetReport.difficulty);

        reportStorage.updateStatus(reportId, ReportStatus.Resolved);
        for (const report of duplicatedReports) {
            reportStorage.updateStatus(report.reportId, ReportStatus.Rejected);
        }
        reportStorage.write();
    }

    public reject(versionName: string, reportId: number): void {
        const reportStorage = this.getReportStorage(versionName);
        reportStorage.updateStatus(reportId, ReportStatus.Rejected);
        reportStorage.write();
    }

    public approveGroup(versionName: string, reportIdList: number[]): void {
        const reportStorage = this.getReportStorage(versionName);
        for (const reportId of reportIdList) {
            const targetReport = reportStorage.getReportById(reportId);
            const duplicatedReports = reportStorage.reports.filter(r =>
                r.reportId !== targetReport.reportId && r.musicId === targetReport.musicId && r.difficulty === targetReport.difficulty);

            reportStorage.updateStatus(reportId, ReportStatus.Resolved);
            for (const duplicated of duplicatedReports) {
                reportStorage.updateStatus(duplicated.reportId, ReportStatus.Rejected);
            }
        }
        reportStorage.write();
    }

    public getMusicDataReport(versionName: string, musicId: number, difficulty: Difficulty): IMusicDataReport {
        return this.getReportStorage(versionName).getMusicDataReport(musicId, difficulty);
    }

    public getBulkReportTableContainer(versionName: string): BulkReportTableContainer {
        const reader = new BulkReportTableReader();
        const spreadsheetId = this.versionModule.getVersionConfig(versionName).bulkReportSpreadsheetId;
        const container = reader.read(spreadsheetId);
        return container;
    }

    public importBulkReport(versionName: string): void {
        const container = this.getBulkReportTableContainer(versionName);
        for (const table of container.getTables()) {
            for (const row of table.rows) {
                if (!row.isValid()) {
                    continue;
                }
                const music = this.musicModule.getSpecifiedVersionRepository(versionName).find({ id: row.musicId });
                if (Music.getVerified(music, row.difficulty)) {
                    continue;
                }
                const musicDataReport = this.getMusicDataReport(versionName, row.musicId, row.difficulty);
                if (!musicDataReport.mainReport) {
                    this.getReportStorage(versionName).push(row, PostLocation.BulkSheet);
                }
            }
        }
        this.getReportStorage(versionName).write();
    }

    public insertReport(versionName: string, formReport: GoogleFormReport): IReport {
        const repository = this.musicModule.getSpecifiedVersionRepository(versionName);

        const targetMusic = repository.getByName(formReport.musicName);
        if (!targetMusic) {
            CustomLogManager.log(
                LogLevel.Error,
                `[検証報告エラー]楽曲表に存在しない楽曲
楽曲名: ${formReport.musicName}
VERSION: ${versionName}`);
            return null;
        }

        if (Music.getVerified(targetMusic, formReport.difficulty)) {
            CustomLogManager.log(
                LogLevel.Error,
                `[検証報告エラー]既に検証済みの楽曲
楽曲名: ${formReport.musicName}
難易度: ${Utility.toDifficultyText(formReport.difficulty)}
VERSION: ${versionName}`);
            return null;
        }

        const diff = formReport.afterOp - formReport.beforeOp;
        if (diff <= 0 || diff > 100) {
            CustomLogManager.log(
                LogLevel.Error,
                `[検証報告エラー]OP変動値が範囲外
${JSON.stringify(formReport)}`);
            return null;
        }

        formReport.bindMusic(repository);
        const storage = this.reportModule.getReportStorage(versionName);
        const report = storage.push(formReport, PostLocation.GoogleForm, formReport.imagePaths);
        storage.write();
        return report;
    }

    public approveLevelBulkReport(versionName: string, bulkReportId: number): void {
        const bulkReportSheet = this.getLevelBulkReportSheet(versionName);
        bulkReportSheet.updateStatus([{ reportId: bulkReportId, status: ReportStatus.Resolved }]);
    }

    public rejectLevelBulkReport(versionName: string, bulkReportId: number): void {
        const bulkReportSheet = this.getLevelBulkReportSheet(versionName);
        bulkReportSheet.updateStatus([{ reportId: bulkReportId, status: ReportStatus.Rejected }]);
    }

    public insertLevelBulkReport(versionName: string, formReport: GoogleFormLevelBulkReport): LevelBulkReport {
        const bulkReportSheet = this.getLevelBulkReportSheet(versionName);
        const musicCount = this.musicModule
            .getSpecifiedVersionRepository(versionName)
            .getTargetLowLevelMusicCount(formReport.targetLevel);
        const maxOp = Math.round((formReport.targetLevel + 3) * 5 * musicCount);
        const checkOp = maxOp + 0.5;

        const opRatio100Fold = Math.round(formReport.opRatio * 100);
        const calcOpRatio100Fold = Math.floor(formReport.op / maxOp * 100 * 100);
        const checkCalcOpRatio100Fold = Math.floor(formReport.op / checkOp * 100 * 100);
        if (opRatio100Fold !== calcOpRatio100Fold) {
            const message = `[一括検証エラー]OP割合推定値とOP割合実測値が一致してません
対象レベル:${formReport.targetLevel}
楽曲数:${musicCount}
OP理論値:${maxOp}
OP実測値:${formReport.op}
OP割合[万分率]:${opRatio100Fold}
実測値と理論値の比率[万分率]:${calcOpRatio100Fold}`;
            CustomLogManager.log(LogLevel.Error, message);
            return null;
        }
        if (calcOpRatio100Fold === checkCalcOpRatio100Fold) {
            const message = `[一括検証エラー]確定ではありません
対象レベル:${formReport.targetLevel}
楽曲数:${musicCount}
OP理論値:${maxOp}
OP実測値:${formReport.op}
OP割合[万分率]:${opRatio100Fold}
実測値と理論値の比率[万分率]:${calcOpRatio100Fold}`;
            CustomLogManager.log(LogLevel.Error, message);
            return null;
        }

        return bulkReportSheet.insertBulkReport({ googleFormBulkReport: formReport });
    }

    public buildForm(versionName: string): void {
        this._reportGoogleForm.buildForm(versionName);
    }

    public buildBulkReportForm(versionName: string): void {
        this._levelBulkReportGoogleForm.buildForm(versionName);
    }
}
