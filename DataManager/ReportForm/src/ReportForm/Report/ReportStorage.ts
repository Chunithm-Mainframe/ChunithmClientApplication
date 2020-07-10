import { Difficulty } from "../../MusicDataTable/Difficulty";
import { MusicDataTable } from "../../MusicDataTable/MusicDataTable";
import { IReport } from "./IReport";
import { IMusicDataReport } from "./IMusicDataReport";
import { ReportStatus } from "./ReportStatus";
import { ReportInputFormat } from "./ReportInputFormat";
import { Report } from "./Report";
import { MusicDataReport } from "./MusicDataReport";

export enum PostLocation {
    GoogleForm,
    BulkSheet,
}

export enum ColumnIndex {
    ReportId,
    MusicId,
    MusicName,
    Difficulty,
    BeforeOp,
    AfterOp,
    Score,
    ComboStatus,
    ImagePaths,
    PostLocation,
    ReportStatus,
    Length,
}

export class ReportStorage {
    private readonly _sheet: GoogleAppsScript.Spreadsheet.Sheet;
    private readonly _reports: Report[] = [];
    private readonly _reportContainers: MusicDataReport[] = [];
    private readonly _reportContainerIndexMap: { [key: string]: number } = {}

    private readonly _rawValueTable: (string | number | boolean)[][] = [];

    public constructor(private readonly _musicDataTable: MusicDataTable, spreadsheetId: string, worksheetName: string) {
        const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
        if (!spreadsheet) {
            throw new Error(`Spreadsheet not found. (${spreadsheetId})`);
        }

        this._sheet = spreadsheet.getSheetByName(worksheetName);
        if (!this._sheet) {
            throw new Error(`Worksheet not found. (${worksheetName})`);
        }

        this._rawValueTable = this._sheet.getDataRange().getValues();
        this.build();
    }

    private build(): void {
        for (let i = 1; i < this._rawValueTable.length; i++) {
            const report = new Report(this._rawValueTable[i]);
            this._reports.push(report);
            this.getOrCreateReportContainer(report.musicId, report.difficulty).push(report);
        }
    }

    public get reports(): IReport[] {
        return this._reports;
    }
    public get reportContainers(): IMusicDataReport[] {
        return this._reportContainers;
    }

    public getReportById(reportId: number): IReport {
        for (let i = 0; i < this._reports.length; i++) {
            if (this._reports[i].reportId === reportId) {
                return this._reports[i];
            }
        }
        return null;
    }

    public push(reportInput: ReportInputFormat, postLocation: PostLocation, imagePaths: string[] = []): IReport {
        const musicData = this._musicDataTable.getMusicDataById(reportInput.musicId);
        if (!musicData) {
            throw new Error(`yÈª¶ÝµÜ¹ñ.
yÈID: ${reportInput.musicId}`);
        }

        const reportContainer = this.getOrCreateReportContainer(reportInput.musicId, reportInput.difficulty);
        if (reportContainer.mainReport && reportContainer.mainReport.reportStatus === ReportStatus.Resolved) {
            throw new Error(`ùÉØÏÝÌyÈ. 
yÈ¼: ${reportContainer.mainReport.musicName}
ïÕx: ${reportContainer.mainReport.difficulty}`);
        }

        const reportId = this._reports.length > 0 ? this._reports[this._reports.length - 1].reportId + 1 : 1;
        const buffer = new Array(ColumnIndex.Length);
        const report = new Report(buffer);
        report.set(reportId, reportInput, musicData.Name, imagePaths, postLocation, ReportStatus.InProgress);
        reportContainer.push(report);
        this._rawValueTable.push(buffer);
        this._reports.push(report);
        return report;
    }

    public write(): void {
        let minIndex: number;
        let maxIndex: number;
        for (minIndex = 0; minIndex < this._reports.length; minIndex++) {
            if (this._reports[minIndex].isDirty) {
                break;
            }
        }
        for (maxIndex = this._reports.length - 1; maxIndex >= minIndex; maxIndex--) {
            if (this._reports[maxIndex].isDirty) {
                break;
            }
        }

        Logger.log(minIndex + ':' + maxIndex);

        if (minIndex <= maxIndex) {
            const values = [];
            for (let i = minIndex; i <= maxIndex; i++) {
                values.push(this._rawValueTable[i + 1]);
            }
            this._sheet.getRange(minIndex + 2, 1, maxIndex - minIndex + 1, ColumnIndex.Length).setValues(values);
        }

        for (let i = 0; i < this._reports.length; i++) {
            this._reports[i].onUpdateStorage();
        }
    }

    private getOrCreateReportContainer(musicId: number, difficulty: Difficulty): MusicDataReport {
        return this.getMusicDataReport(musicId, difficulty) || this.createReportContainer(musicId, difficulty);
    }

    public getMusicDataReport(musicId: number, difficulty: Difficulty): MusicDataReport {
        const key = this.getIndexMapKey(musicId, difficulty);
        if (!(key in this._reportContainerIndexMap)) {
            return null;
        }
        return this._reportContainers[this._reportContainerIndexMap[key]];
    }

    private createReportContainer(musicId: number, difficulty: Difficulty): MusicDataReport {
        const key = this.getIndexMapKey(musicId, difficulty);
        const musicData = this._musicDataTable.getMusicDataById(musicId);
        const reportContainer = new MusicDataReport(musicData, difficulty);
        const length = this._reportContainers.push(reportContainer);
        this._reportContainerIndexMap[key] = length - 1;
        return reportContainer;
    }

    private getIndexMapKey(musicId: number, difficulty: Difficulty): string {
        return musicId + '#' + difficulty;
    }

    public updateStatus(reportId: number, status: ReportStatus): void {
        for (const report of this._reports) {
            if (report.reportId === reportId) {
                report.reportStatus = status;
                break;
            }
        }
    }
}
