import { Difficulty } from "../../Layer1/Difficulty";
import { MusicRepository } from "../Music/MusicRepository";
import { IMusicDataReport } from "./IMusicDataReport";
import { IReport } from "./IReport";
import { MusicDataReport } from "./MusicDataReport";
import { Report } from "./Report";
import { ReportInputFormat } from "./ReportInputFormat";
import { ReportStatus } from "./ReportStatus";

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

    public constructor(private readonly _musicRepository: MusicRepository, spreadsheetId: string, worksheetName: string) {
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
            this.getMusicDataReport(report.musicId, report.difficulty).push(report);
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
        const music = this._musicRepository.find({ id: reportInput.musicId });
        if (!music) {
            throw new Error(`楽曲が存在しません.
楽曲ID: ${reportInput.musicId}`);
        }

        const reportContainer = this.getMusicDataReport(reportInput.musicId, reportInput.difficulty);
        if (reportContainer.mainReport && reportContainer.mainReport.reportStatus === ReportStatus.Resolved) {
            throw new Error(`既に検証済みの楽曲. 
楽曲名: ${reportContainer.mainReport.musicName}
難易度: ${reportContainer.mainReport.difficulty}`);
        }

        const reportId = this._reports.length > 0 ? this._reports[this._reports.length - 1].reportId + 1 : 1;
        const buffer = new Array(ColumnIndex.Length);
        const report = new Report(buffer);
        report.set(reportId, reportInput, music.name, imagePaths, postLocation, ReportStatus.InProgress);
        reportContainer.push(report);
        this._rawValueTable.push(buffer);
        this._reports.push(report);
        return report;
    }

    public getMusicDataReport(musicId: number, difficulty: Difficulty): MusicDataReport {
        const key = this.getIndexMapKey(musicId, difficulty);
        if (key in this._reportContainerIndexMap) {
            return this._reportContainers[this._reportContainerIndexMap[key]];
        }

        const music = this._musicRepository.find({ id: musicId });
        const reportContainer = new MusicDataReport(musicId, difficulty, music);
        const length = this._reportContainers.push(reportContainer);
        this._reportContainerIndexMap[key] = length - 1;
        return reportContainer;
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
