import { LogLevel } from "../../../../../Packages/CustomLogger/CustomLogger";
import { CustomLogManager } from "../../../../../Packages/CustomLogger/CustomLogManager";
import { Difficulty } from "../../../Layer1/Difficulty";
import { Music } from "../../../Layer2/Music/Music";
import { MusicTable } from "../../../Layer2/Music/MusicTable";
import { BulkReportTableContainer } from "../../../Layer2/Report/BulkReport/BulkReportTableContainer";
import { BulkReportTableReader } from "../../../Layer2/Report/BulkReport/BulkReportTableReader";
import { LevelRawReport } from "../../../Layer2/Report/LevelReport/LevelRawReport";
import { LevelReport } from "../../../Layer2/Report/LevelReport/LevelReport";
import { LevelReportTable } from "../../../Layer2/Report/LevelReport/LevelReportTable";
import { MasterUnitRecordGroup } from "../../../Layer2/Report/MasterUnitRecordGroup/MasterUnitRecordGroup";
import { MasterUnitReportGroupTable } from "../../../Layer2/Report/MasterUnitRecordGroup/MasterUnitReportGroupTable";
import { PostLocation } from "../../../Layer2/Report/PostLocation";
import { ReportStatus } from "../../../Layer2/Report/ReportStatus";
import { UnitRawReport } from "../../../Layer2/Report/UnitReport/UnitRawReport";
import { UnitReport } from "../../../Layer2/Report/UnitReport/UnitReport";
import { UnitReportTable } from "../../../Layer2/Report/UnitReport/UnitReportTable";
import { UnitReportBundle } from "../../../Layer2/Report/UnitReportGroup/UnitReportBundle";
import { UnitReportBundleGroup } from "../../../Layer2/Report/UnitReportGroup/UnitReportBundleGroup";
import { Utility } from "../../../Layer2/Utility";
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
    private readonly _musicReportGroupTableMap: Record<string, MasterUnitReportGroupTable> = {};

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

    public getMasterUnitReportGroupTable(versionName: string): MasterUnitReportGroupTable {
        if (versionName in this._musicReportGroupTableMap) {
            return this._musicReportGroupTableMap[versionName];
        }
        const versionConfig = this.versionModule.getVersionConfig(versionName);
        const spreadsheetId = versionConfig.masterUnitReportGroupSpreadsheetId;
        const worksheetName = versionConfig.masterUnitReportGroupWorksheetName;
        const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(worksheetName)
        this._musicReportGroupTableMap[versionName] = new MasterUnitReportGroupTable(sheet);
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

    public approveUnitReportGroup(versionName: string, masterUnitReportGroupId: string): void {
        const unitReportBundleGroup = this.getUnitReportBundleGroup(versionName, masterUnitReportGroupId);

        const updatedUnitReports: UnitReport[] = [];
        for (const unitReportBundle of unitReportBundleGroup.unitReportBundles) {
            const target = unitReportBundle.activeReport;
            if (!target) {
                continue;
            }
            target.reportStatus = ReportStatus.Resolved;
            updatedUnitReports.push(target);

            unitReportBundle.unitReports
                .filter(x => x.reportId !== target.reportId)
                .forEach(x => {
                    x.reportStatus = ReportStatus.Rejected;
                    updatedUnitReports.push(x);
                });
        }

        this.getUnitReportTable(versionName).update(updatedUnitReports);
    }

    public getUnitReportBundleGroups(versionName: string): UnitReportBundleGroup[] {
        const masterUnitReportGroupTable = this.getMasterUnitReportGroupTable(versionName);
        const unitReportTable = this.getUnitReportTable(versionName);
        const musicTable = this.musicModule.getMusicTable(versionName);

        const masterUnitReportGroupCollectionMap: Record<string, MasterUnitRecordGroup[]> = {};
        for (const record of masterUnitReportGroupTable.records) {
            if (!(record.groupId in masterUnitReportGroupCollectionMap)) {
                masterUnitReportGroupCollectionMap[record.groupId] = [];
            }
            masterUnitReportGroupCollectionMap[record.groupId].push(record);
        }

        const unitReportCollectionMap = this.getUnitReportCollectionMap(unitReportTable);
        return Object.keys(masterUnitReportGroupCollectionMap)
            .map(x => this.getUnitReportBundleGroupInternal(
                musicTable,
                x,
                masterUnitReportGroupCollectionMap[x],
                unitReportCollectionMap))
    }

    public getUnitReportBundleGroup(versionName: string, masterUnitReportGroupId: string): UnitReportBundleGroup {
        const masterUnitReportGroupTable = this.getMasterUnitReportGroupTable(versionName);
        const targetRecords = masterUnitReportGroupTable.records
            .filter(x => x.groupId === masterUnitReportGroupId);
        if (targetRecords.length === 0) {
            return null;
        }

        const unitReportTable = this.getUnitReportTable(versionName);
        const musicTable = this.musicModule.getMusicTable(versionName);
        return this.getUnitReportBundleGroupInternal(
            musicTable,
            masterUnitReportGroupId,
            targetRecords,
            this.getUnitReportCollectionMap(unitReportTable));
    }

    private getUnitReportBundleGroupInternal(
        musicTable: MusicTable,
        masterUnitReportGroupId: string,
        masterUnitReprotGroups: MasterUnitRecordGroup[],
        unitReportCollectionMap: Record<string, UnitReport[]>): UnitReportBundleGroup {

        return new UnitReportBundleGroup(
            masterUnitReportGroupId,
            masterUnitReprotGroups.map(x => new UnitReportBundle(
                x.musicId,
                x.difficulty,
                musicTable.find({ id: x.musicId }) ? true : false,
                unitReportCollectionMap[`${x.musicId}:${x.difficulty}`] ?? [])));
    }

    private getUnitReportCollectionMap(unitReportTable: UnitReportTable): Record<string, UnitReport[]> {
        const unitReportCollectionMap: Record<string, UnitReport[]> = {};
        for (const unitReport of unitReportTable.records) {
            const key = `${unitReport.musicId}:${unitReport.difficulty}`;
            if (!(key in unitReportCollectionMap)) {
                unitReportCollectionMap[key] = [];
            }
            unitReportCollectionMap[key].push(unitReport);
        }
        return unitReportCollectionMap;
    }

    public getUnitReportBundle(versionName: string, musicId: number, difficulty: Difficulty): UnitReportBundle {
        const unitReportTable = this.getUnitReportTable(versionName);
        const musicTable = this.musicModule.getMusicTable(versionName);

        return new UnitReportBundle(
            musicId,
            difficulty,
            musicTable.find({ id: musicId }) ? true : false,
            unitReportTable.records.filter(x => x.musicId === musicId && x.difficulty === difficulty));
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
                const unitReportBundle = this.getUnitReportBundle(versionName, row.musicId, row.difficulty);
                if (!unitReportBundle.activeReport) {
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

    public updateMusicsUnitReportForm(versionName: string): void {
        const musics = this.musicModule.getMusicTable(versionName).records;
        const genres = this.versionModule.getVersionConfig(versionName).genres;
        const listItems = this._unitReportGoogleForm.form.getItems(FormApp.ItemType.LIST).map(x => x.asListItem());

        for (let i = 0; i < genres.length; i++) {
            const musicNames = musics
                .filter(x => x.genre === genres[i])
                .map(x => x.name);
            if (musicNames.length > 0) {
                listItems[i + 1].setChoiceValues(musicNames);
            }
            else {
                listItems[i + 1].setChoiceValues([""]);
            }
        }
    }
}
