import { ReportStatus } from "../ReportStatus";
import { LevelRawReport } from "./LevelRawReport";

export class LevelReport {
    private _reportId: number;
    private _targetLevel: number;
    private _musicCount: number;
    private _op: number;
    private _opRatio: number;
    private _imagePaths: string[];
    private _reportDate: Date;
    private _reportStatus: ReportStatus;

    public static createByRow(row: Object[]): LevelReport {
        return new LevelReport(
            parseInt(row[0].toString()),
            parseInt(row[1].toString()),
            parseInt(row[2].toString()),
            parseFloat(row[3].toString()),
            parseFloat(row[4].toString()),
            row[5].toString() ? row[5].toString().split(',') : [],
            new Date(row[6].toString()),
            parseInt(row[7].toString())
        );
    }

    public static createByGoogleFormBulkReport(reportId: number, bulkReport: LevelRawReport, musicCount: number, reportDate: Date, reportStatus: ReportStatus): LevelReport {
        return new LevelReport(
            reportId,
            bulkReport.targetLevel,
            musicCount,
            bulkReport.op,
            bulkReport.opRatio,
            bulkReport.imagePaths,
            reportDate,
            reportStatus
        );
    }

    public constructor(
        reportId: number,
        targetLevel: number,
        musicCount: number,
        op: number,
        opRatio: number,
        imagePaths: string[],
        reportDate: Date,
        reportStatus: ReportStatus) {
        this._reportId = reportId;
        this._targetLevel = targetLevel;
        this._musicCount = musicCount;
        this._op = op;
        this._opRatio = opRatio;
        this._imagePaths = imagePaths;
        this._reportDate = reportDate;
        this._reportStatus = reportStatus;
    }

    public get reportId(): number {
        return this._reportId;
    }
    public get targetLevel(): number {
        return this._targetLevel;
    };
    public get musicCount(): number {
        return this._musicCount;
    }
    public get op(): number {
        return this._op;
    }
    public get opRatio(): number {
        return this._opRatio;
    }
    public get imagePaths(): string[] {
        return this._imagePaths;
    }
    public get reportDate(): Date {
        return this._reportDate;
    }
    public get reportStatus(): ReportStatus {
        return this._reportStatus;
    }
    public set reportStatus(value: ReportStatus) {
        this._reportStatus = value;
    }

    public toRawData(): Object[] {
        return [
            this._reportId,
            this._targetLevel,
            this._musicCount,
            this._op,
            this._opRatio,
            (this._imagePaths && this._imagePaths.length > 0) ? this._imagePaths.reduce(function (acc, src) { return `${acc},${src}`; }) : "",
            this._reportDate.toString(),
            this._reportStatus,
        ];
    }
}
