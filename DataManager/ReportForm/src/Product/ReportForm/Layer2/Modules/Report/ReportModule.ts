import { LogLevel } from "../../../../../Packages/CustomLogger/CustomLogger";
import { CustomLogManager } from "../../../../../Packages/CustomLogger/CustomLogManager";
import { Difficulty } from "../../../Layer1/Difficulty";
import { Music } from "../../Music/Music";
import { BulkReportTableContainer } from "../../Report/BulkReport/BulkReportTableContainer";
import { BulkReportTableReader } from "../../Report/BulkReport/BulkReportTableReader";
import { LevelRawReport } from "../../Report/LevelReport/LevelRawReport";
import { LevelReport } from "../../Report/LevelReport/LevelReport";
import { LevelReportTable } from "../../Report/LevelReport/LevelReportTable";
import { MusicReportGroupTable } from "../../Report/MusicReportGroup/MusicReportGroupTable";
import { PostLocation } from "../../Report/PostLocation";
import { ReportStatus } from "../../Report/ReportStatus";
import { UnitRawReport } from "../../Report/UnitReport/UnitRawReport";
import { UnitReport } from "../../Report/UnitReport/UnitReport";
import { UnitReportTable } from "../../Report/UnitReport/UnitReportTable";
import { UnitReportGroup } from "../../Report/UnitReportGroup/UnitReportGroup";
import { Utility } from "../../Utility";
import { ReportFormModule } from "../@ReportFormModule";
import { LINEModule } from "../LINEModule";
import { MusicModule } from "../MusicModule";
import { VersionModule } from "../VersionModule";
import { LevelReportGoogleForm } from "./LevelReportGoogleForm";
import { UnitReportGoogleForm } from "./UnitReportGoogleForm";

export class ReportModule extends ReportFormModule {
    public static readonly moduleName = 'report';

    private get lineModule(): LINEModule { return this.getModule(LINEModule); }
    private get musicModule(): MusicModule { return this.getModule(MusicModule); }
    private get versionModule(): VersionModule { return this.getModule(VersionModule); }

    private readonly _unitReportGoogleForm = new UnitReportGoogleForm(this);
    private readonly _levelReportGoogleForm = new LevelReportGoogleForm(this);

    private readonly _unitReportTableMap: Record<string, UnitReportTable> = {};
    private readonly _levelReportTableMap: Record<string, LevelReportTable> = {};
    private readonly _musicReportGroupTableMap: Record<string, MusicReportGroupTable> = {};

    public get unitReportGoogleForm(): GoogleAppsScript.Forms.Form {
        return this._unitReportGoogleForm.form;
    }

    public get levelReportGoogleForm(): GoogleAppsScript.Forms.Form {
        return this._levelReportGoogleForm.form;
    }

    public noticeReportPost(message: string): void {
        if (this.configuration.runtime.lineNoticeUnitReportEnabled) {
            this.lineModule.pushNoticeMessage([message]);
        }
    }

    public getUnitReportTable(versionName: string): UnitReportTable {
        if (versionName in this._unitReportTableMap) {
            return this._unitReportTableMap[versionName];
        }
        const versionConfig = this.versionModule.getVersionConfig(versionName);
        const spreadsheetId = versionConfig.unitReportSpreadsheetId;
        const worksheetName = versionConfig.unitReportWorksheetName;
        const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(worksheetName);
        this._unitReportTableMap[versionName] = new UnitReportTable(sheet);
        return this._unitReportTableMap[versionName];
    }

    public getUnitReports(versionName: string): UnitReport[] {
        return this.getUnitReportTable(versionName).records;
    }

    public getUnitReport(versionName: string, reportId: number): UnitReport {
        return this.getUnitReportTable(versionName).find({ reportId: reportId });
    }

    public getLevelReportTable(versionName: string): LevelReportTable {
        if (versionName in this._levelReportTableMap) {
            return this._levelReportTableMap[versionName];
        }
        const versionConfig = this.versionModule.getVersionConfig(versionName);
        const spreadsheetId = versionConfig.levelReportSpreadsheetId;
        const worksheetName = versionConfig.levelReportWorksheetName;
        const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(worksheetName)
        this._levelReportTableMap[versionName] = new LevelReportTable(sheet);
        return this._levelReportTableMap[versionName];
    }

    public getLevelReport(versionName: string, reportId: number): LevelReport {
        return this.getLevelReportTable(versionName).find({ reportId: reportId });
    }

    public getLevelReports(versionName: string): LevelReport[] {
        return this.getLevelReportTable(versionName).records;
    }

    public getMusicReportGroupTable(versionName: string): MusicReportGroupTable {
        if (versionName in this._musicReportGroupTableMap) {
            return this._musicReportGroupTableMap[versionName];
        }
        const versionConfig = this.versionModule.getVersionConfig(versionName);
        const spreadsheetId = versionConfig.musicReportGroupSpreadsheetId;
        const worksheetName = versionConfig.musicReportGroupWorksheetName;
        const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(worksheetName)
        this._musicReportGroupTableMap[versionName] = new MusicReportGroupTable(sheet);
        return this._musicReportGroupTableMap[versionName];
    }

    public approveUnitReport(versionName: string, reportId: number): void {
        const table = this.getUnitReportTable(versionName);

        const target = table.find({ reportId: reportId });
        target.reportStatus = ReportStatus.Resolved;

        const duplicatedReports = table.records
            .filter(x => x.reportId !== reportId && x.musicId === target.musicId && x.difficulty === target.difficulty);
        duplicatedReports.forEach(x => x.reportStatus = ReportStatus.Rejected);

        table.update([target].concat(duplicatedReports));
        this.approveUnitReports(versionName, [reportId]);
    }

    public approveUnitReports(versionName: string, reportIds: number[]): void {
        const reportTable = this.getUnitReportTable(versionName);
        const updatedReports: UnitReport[] = [];
        for (const reportId of reportIds) {
            const target = reportTable.find({ reportId: reportId });
            target.reportStatus = ReportStatus.Resolved;
            updatedReports.push(target);

            const duplicatedReports = reportTable.records
                .filter(x => x.reportId !== reportId && x.musicId === target.musicId && x.difficulty === target.difficulty);
            duplicatedReports.forEach(x => {
                x.reportStatus = ReportStatus.Rejected;
                updatedReports.push(target);
            });
        }
        reportTable.update(updatedReports);
    }

    public rejectUnitReport(versionName: string, reportId: number): void {
        const table = this.getUnitReportTable(versionName);
        const target = table.find({ reportId: reportId });
        target.reportStatus = ReportStatus.Rejected;
        table.update(target);
    }

    public approveMusicReportGroup(versionName: string, groupId: string): void {
        const unitReportGroups = this.getUnitReportGroups(versionName, groupId).filter(x => x.isValid());

        const updatedUnitReports: UnitReport[] = [];
        for (const unitReportGroup of unitReportGroups) {
            const target = unitReportGroup.getMainReport();
            if (!target) {
                continue;
            }
            target.reportStatus = ReportStatus.Resolved;
            updatedUnitReports.push(target);

            const duplicatedReports = unitReportGroup.getReports().filter(x => x.reportId !== target.reportId);
            duplicatedReports.forEach(x => {
                x.reportStatus = ReportStatus.Rejected;
                updatedUnitReports.push(x);
            });
        }

        this.getUnitReportTable(versionName).update(updatedUnitReports);
    }

    public getUnitReportGroups(versionName: string, groupId: string): UnitReportGroup[] {
        const musicReportGroupTable = this.getMusicReportGroupTable(versionName);
        const musicReportGroups = musicReportGroupTable.getByGroupId(groupId);
        const unitReportTable = this.getUnitReportTable(versionName);
        const musicTable = this.musicModule.getMusicTable(versionName);
        return musicReportGroups
            .map(x => new UnitReportGroup(unitReportTable, x.musicId, x.difficulty, musicTable.find({ id: x.musicId })));
    }

    public getUnitReportGroup(versionName: string, musicId: number, difficulty: Difficulty): UnitReportGroup {
        const reportTable = this.getUnitReportTable(versionName);
        const musicTable = this.musicModule.getMusicTable(versionName);
        return new UnitReportGroup(reportTable, musicId, difficulty, musicTable.find({ id: musicId }));
    }

    public getBulkReportTableContainer(versionName: string): BulkReportTableContainer {
        const reader = new BulkReportTableReader();
        const spreadsheetId = this.versionModule.getVersionConfig(versionName).bulkReportSpreadsheetId;
        const container = reader.read(spreadsheetId);
        return container;
    }

    public importBulkReport(versionName: string): void {
        const addedReports: UnitReport[] = [];
        const container = this.getBulkReportTableContainer(versionName);
        for (const table of container.getTables()) {
            for (const row of table.rows) {
                if (!row.isValid()) {
                    continue;
                }
                const music = this.musicModule.getMusicTable(versionName).find({ id: row.musicId });
                if (Music.getVerified(music, row.difficulty)) {
                    continue;
                }
                const unitReportGroup = this.getUnitReportGroup(versionName, row.musicId, row.difficulty);
                if (!unitReportGroup.getMainReport()) {
                    const report = UnitReportTable.instantiateRecord(row);
                    report.postLocation = PostLocation.BulkSheet;
                    addedReports.push(report);
                }
            }
        }
        this.getUnitReportTable(versionName).update(addedReports);
    }

    public insertReport(versionName: string, formReport: UnitRawReport): UnitReport {
        const table = this.musicModule.getMusicTable(versionName);

        const targetMusic = table.getByName(formReport.musicName);
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

        formReport.bindMusic(table);
        const report = UnitReportTable.instantiateRecordByRawReport(formReport);
        const reportTable = this.getUnitReportTable(versionName);
        const result = reportTable.update(report);
        return result.added[0];
    }

    public approveLevelReport(versionName: string, reportId: number): void {
        const table = this.getLevelReportTable(versionName);
        const target = table.find({ reportId: reportId });
        target.reportStatus = ReportStatus.Resolved;
        table.update(target);
    }

    public rejectLevelReport(versionName: string, reportId: number): void {
        const table = this.getLevelReportTable(versionName);
        const target = table.find({ reportId: reportId });
        target.reportStatus = ReportStatus.Rejected;
        table.update(target);
    }

    public insertLevelBulkReport(versionName: string, formReport: LevelRawReport): LevelReport {
        const musicCount = this.musicModule
            .getMusicTable(versionName)
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

        const report = LevelReport.instantiateByRawReport(formReport, musicCount);
        const table = this.getLevelReportTable(versionName);
        return table.update(report).added[0];
    }

    public buildForm(versionName: string): void {
        this._unitReportGoogleForm.buildForm(versionName);
    }

    public buildBulkReportForm(versionName: string): void {
        this._levelReportGoogleForm.buildForm(versionName);
    }
}
