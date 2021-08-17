import { Difficulty } from "../../Layer1/Difficulty";
import { MusicData } from "../MusicDataTable/MusicData";
import { IMusicDataReport } from "./IMusicDataReport";
import { IReport } from "./IReport";
import { Report } from "./Report";
import { ReportStatus } from "./ReportStatus";
import { PostLocation } from "./ReportStorage";
export class MusicDataReport implements IMusicDataReport {
    private readonly _reports: Report[] = [];
    public constructor(private readonly _musicId: number, private readonly _difficulty: Difficulty, private readonly _musicData: MusicData) {
    }
    public push(report: Report): boolean {
        const add = !this.getReportByReportId(report.reportId);
        if (add) {
            this._cachedMainReport = null;
            this._reports.push(report);
        }
        return add;
    }
    public get musicId(): number { return this._musicId; }
    public get difficulty(): Difficulty { return this._difficulty; }
    public get valid(): boolean { return this._musicData ? true : false; }
    public get verified(): boolean {
        if (this._musicData && this._musicData.getVerified(this._difficulty)) {
            return true;
        }
        return this.mainReport && this.mainReport.reportStatus === ReportStatus.Resolved;
    }

    public get reports(): IReport[] { return this._reports; }
    private _cachedMainReport: Report = null;
    public get mainReport(): IReport {
        if (!this._musicData || this._musicData.getVerified(this._difficulty)) {
            return null;
        }
        if (this._cachedMainReport) {
            return this._cachedMainReport;
        }
        this._cachedMainReport = this.getMainReport(this._reports);
        return this._cachedMainReport;
    }
    private getMainReport(reports: Report[]): Report {
        let ret: Report = null;
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
    public find(predicate: (report: Report) => boolean): IReport {
        for (const report of this._reports) {
            if (predicate(report)) {
                return report;
            }
        }
        return null;
    }
}
