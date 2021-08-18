import { Difficulty } from "../../Layer1/Difficulty";
import { Music } from "../Music/Music";
import { IMusicDataReport } from "./IMusicDataReport";
import { IReport } from "./IReport";
import { UnitReport } from "./UnitReport/UnitReport";
import { ReportStatus } from "./ReportStatus";
import { PostLocation } from "./ReportStorage";
export class MusicDataReport implements IMusicDataReport {
    private readonly _reports: UnitReport[] = [];
    public constructor(private readonly _musicId: number, private readonly _difficulty: Difficulty, private readonly _music: Music) {
    }
    public push(report: UnitReport): boolean {
        const add = !this.getReportByReportId(report.reportId);
        if (add) {
            this._cachedMainReport = null;
            this._reports.push(report);
        }
        return add;
    }
    public get musicId(): number { return this._musicId; }
    public get difficulty(): Difficulty { return this._difficulty; }
    public get valid(): boolean { return this._music ? true : false; }
    public get verified(): boolean {
        if (this._music && Music.getVerified(this._music, this._difficulty)) {
            return true;
        }
        return this.mainReport && this.mainReport.reportStatus === ReportStatus.Resolved;
    }

    public get reports(): IReport[] { return this._reports; }
    private _cachedMainReport: UnitReport = null;
    public get mainReport(): IReport {
        if (!this._music || Music.getVerified(this._music, this._difficulty)) {
            return null;
        }
        if (this._cachedMainReport) {
            return this._cachedMainReport;
        }
        this._cachedMainReport = this.getMainReport(this._reports);
        return this._cachedMainReport;
    }
    private getMainReport(reports: UnitReport[]): UnitReport {
        let ret: UnitReport = null;
        for (let i = 0; i < reports.length; i++) {
            const report = reports[i];
            if (report.reportStatus === ReportStatus.Resolved) {
                return report;
            }
            if (report.reportStatus === ReportStatus.Rejected) {
                continue;
            }
            if (!ret) {
                ret = report;
                continue;
            }
            // ここに来る時点でretとreportはともにreportStatusがInProgressである
            // BulkSheetで報告されたものより、GoogleFormで報告されたものを優先する
            if (ret.postLocation === PostLocation.BulkSheet && report.postLocation === PostLocation.GoogleForm) {
                ret = report;
                continue;
            }
            // 日時が古いものより新しいもの=ReportIDが大きいものを優先する
            if (ret.reportId > report.reportId) {
                ret = report;
                continue;
            }
        }
        return ret;
    }
    public getReportByReportId(reportId: number): IReport {
        for (let i = 0; i < this._reports.length; i++) {
            if (this._reports[i].reportId === reportId) {
                return this._reports[i];
            }
        }
        return null;
    }
    public find(predicate: (report: UnitReport) => boolean): IReport {
        for (const report of this._reports) {
            if (predicate(report)) {
                return report;
            }
        }
        return null;
    }
}
