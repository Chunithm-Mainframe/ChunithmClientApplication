import { Difficulty } from "../../../Layer1/Difficulty";
import { PostLocation } from "../PostLocation";
import { ReportStatus } from "../ReportStatus";
import { UnitReport } from "../UnitReport/UnitReport";

export class UnitReportBundle {
    public get musicId(): number { return this._musicId; }
    public get difficulty(): Difficulty { return this._difficulty; }
    public get isValidMusic(): boolean { return this._isValidMusic; }
    public get unitReports(): UnitReport[] { return this._unitReports; }

    private readonly _activeReport: UnitReport;
    public get activeReport(): UnitReport { return this._activeReport; }

    public get verified(): boolean {
        return this._activeReport && this._activeReport.reportStatus === ReportStatus.Resolved;
    }

    public constructor(
        private readonly _musicId: number,
        private readonly _difficulty: Difficulty,
        private readonly _isValidMusic: boolean,
        private readonly _unitReports: UnitReport[]) {
        this._activeReport = UnitReportBundle.getActiveReport(_unitReports);
    }

    private static getActiveReport(reports: UnitReport[]): UnitReport {
        let ret: UnitReport = null;
        for (const report of reports) {
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
            // 報告日時が新しいものを優先する
            if (ret.createdAt > report.createdAt) {
                ret = report;
                continue;
            }
        }
        return ret;
    }
}
