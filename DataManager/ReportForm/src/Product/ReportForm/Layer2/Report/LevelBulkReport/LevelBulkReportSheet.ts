import { MusicRepository } from "../../Music/MusicRepository";
import { ReportStatus } from "../ReportStatus";
import { GoogleFormLevelBulkReport } from "./GoogleFormLevelBulkReport";
import { LevelBulkReport } from "./LevelBulkReport";

export class LevelBulkReportSheet {
    private _musicRepository: MusicRepository = null;
    private _sheet: GoogleAppsScript.Spreadsheet.Sheet = null;
    private _bulkReports: LevelBulkReport[] = [];
    private _bulkReportIndexMap: { [key: string]: number } = {};

    public constructor(repository: MusicRepository, spreadsheetId: string, worksheetName: string) {
        let spreadsheet = SpreadsheetApp.openById(spreadsheetId);
        if (!spreadsheet) {
            throw new Error(`Spreadsheet not found. (${spreadsheetId})`);
        }

        let sheet = spreadsheet.getSheetByName(worksheetName);
        if (!sheet) {
            throw new Error(`Worksheet not found. (${worksheetName})`);
        }

        this._musicRepository = repository;
        this._sheet = sheet;
        this.readBulkReports();
    }

    private readBulkReports(): void {
        this._bulkReports.length = 0;
        this._bulkReportIndexMap = {};
        let rawBulkReports = this._sheet.getDataRange().getValues();
        for (var i = 1; i < rawBulkReports.length; i++) {
            let report = LevelBulkReport.createByRow(rawBulkReports[i]);
            let index = this._bulkReports.push(report) - 1;
            this._bulkReportIndexMap[report.reportId.toString()] = index;
        }
    }

    public get bulkReports(): LevelBulkReport[] {
        return this._bulkReports;
    }

    public getBulkReport(reportId: number): LevelBulkReport {
        if (!(reportId.toString() in this._bulkReportIndexMap)) {
            return null;
        }
        return this.bulkReports[this._bulkReportIndexMap[reportId.toString()]];
    }

    public insertBulkReport({ googleFormBulkReport, reportStatus = ReportStatus.InProgress }: { googleFormBulkReport: GoogleFormLevelBulkReport; reportStatus?: ReportStatus; }): LevelBulkReport {
        let reportId = this.bulkReports.length > 0
            ? this.bulkReports[this.bulkReports.length - 1].reportId + 1
            : 1;
        let report = LevelBulkReport.createByGoogleFormBulkReport(
            reportId,
            googleFormBulkReport,
            this._musicRepository.getTargetLowLevelMusicCount(googleFormBulkReport.targetLevel),
            new Date(),
            reportStatus);
        let index = this._bulkReports.push(report) - 1;
        this._bulkReportIndexMap[reportId.toString()] = index;

        let row = this.bulkReports.length + 1;
        let rawReport = report.toRawData();
        this._sheet.getRange(row, 1, 1, rawReport.length).setValues([rawReport]);
        return report;
    }

    public updateStatus(updateList: { reportId: number, status: ReportStatus }[]): void {
        let table = this._sheet.getDataRange().getValues();
        for (let target of updateList) {
            for (var i = 0; i < table.length; i++) {
                let reportId = parseInt(table[i][0]);
                if (reportId == target.reportId) {
                    this._sheet.getRange(i + 1, 8).setValue(target.status);
                }
            }
        }
    }
}
