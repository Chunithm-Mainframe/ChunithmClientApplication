import { Difficulty } from "../../../Layer1/Difficulty";
import { ComboStatus, calcBaseRating } from "../../../Layer1/Rating";
import { ReportStatus } from "../ReportStatus";
import { PostLocation } from "../PostLocation";
import { UnitRawReport } from "./UnitRawReport";
import { UnitReportTable } from "./UnitReportTable";

export class UnitReport {
    public reportId = 0;
    public musicId = 0;
    public musicName = '';
    public difficulty = Difficulty.Invalid;
    public beforeOp = 0;
    public afterOp = 0;
    public score = 0;
    public comboStatus = ComboStatus.None;
    public imagePathText = '';
    public postLocation = PostLocation.GoogleForm;
    public reportStatus = ReportStatus.InProgress;
    public createdAt: Date = null;

    public get imagePaths(): string[] {
        if (!this.imagePathText) {
            return [];
        }
        return this.imagePathText.split(',');
    }

    public static instantiate(obj: Required<UnitReport>): UnitReport {
        return UnitReportTable.instantiateRecord(obj);
    }
    public static instantiateByRawReport(rawReport: UnitRawReport): UnitReport {
        return UnitReportTable.instantiateRecordByRawReport(rawReport);
    }

    public calculateBaseRating(): number {
        let comboStatus = ComboStatus.None;
        switch (this.comboStatus) {
            case ComboStatus.AllJustice:
                comboStatus = ComboStatus.AllJustice;
                break;
            case ComboStatus.FullCombo:
                comboStatus = ComboStatus.FullCombo;
                break;
        }
        return calcBaseRating(this.beforeOp, this.afterOp, this.score, comboStatus);
    }
}
