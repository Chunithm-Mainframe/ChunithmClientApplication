import { DatabaseTable } from "../../../../../Packages/Database/DatabaseTable";
import { Difficulty } from "../../../Layer1/Difficulty";
import { UnitReport } from "../UnitReport/UnitReport";
import { ReportStatus } from "../ReportStatus";
import { PostLocation } from "../PostLocation";
import { Music } from "../../Music/Music";

export class UnitReportGroup {
    public get musicId(): number { return this._musicId; }
    public get difficulty(): Difficulty { return this._musicId; }

    public constructor(
        private readonly _table: DatabaseTable<UnitReport, 'reportId'>,
        private readonly _musicId: number,
        private readonly _difficulty: Difficulty,
        private readonly _music: Music
    ) {
    }

    public isValid(): boolean {
        return this._music ? true : false;
    }

    public getReports(): UnitReport[] {
        return this._table.records
            .filter(x => x.musicId === this._musicId && x.difficulty === this._difficulty);
    }

    public getMainReport(): UnitReport {
        const reports = this.getReports();
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

    public verified(): boolean {
        const mainReport = this.getMainReport();
        return mainReport && mainReport.reportStatus === ReportStatus.Resolved;
    }
}
