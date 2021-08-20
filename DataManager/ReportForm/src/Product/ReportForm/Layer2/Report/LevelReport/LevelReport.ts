import { ReportStatus } from "../ReportStatus";
import { LevelRawReport } from "./LevelRawReport";
import { LevelReportTable } from "./LevelReportTable";
export class LevelReport {
    public reportId = 0;
    public level = 0;
    public musicCount = 0;
    public op = 0;
    public opRatio = 0;
    public imagePathText = '';
    public reportStatus = ReportStatus.InProgress;
    public createdAt: Date = null;
    public get imagePaths(): string[] {
        if (!this.imagePathText) {
            return [];
        }
        return this.imagePathText.split(',');
    }
    public static instantiateByRawReport(rawReport: LevelRawReport, musicCount: number): LevelReport {
        return LevelReportTable.instantiateRecord(rawReport, musicCount);
    }
}
