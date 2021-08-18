import { GenericDatabaseTableSchema } from "../../../../../Packages/Database/GenericDatabaseSchema";
import { SpreadsheetDatabaseTable } from "../../../../../Packages/Database/SpreadsheetDatabaseTable";
import { Difficulty } from "../../../Layer1/Difficulty";
import { ComboStatus } from "../../../Layer1/Rating";
import { ReportStatus } from "../ReportStatus";
import { PostLocation } from "../ReportStorage";
import { UnitRawReport } from "./UnitRawReport";


export class UnitReportSchema {
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

    public static instantiate(obj: Required<UnitReportSchema>): UnitReportSchema {
        const instance = new UnitReportSchema();
        for (const key in instance) {
            instance[key] = obj[key];
        }
        return instance;
    }

    public static instantiateByRawReport(rawReport: UnitRawReport): UnitReportSchema {
        const report = new UnitReportSchema();
        report.musicId = rawReport.musicId;
        report.musicName = rawReport.musicName;
        report.difficulty = rawReport.difficulty;
        report.beforeOp = rawReport.beforeOp;
        report.afterOp = rawReport.afterOp;
        report.score = rawReport.score;
        report.comboStatus = rawReport.comboStatus;
        report.imagePathText = rawReport.imagePaths.join(',');
        return report;
    }
}

export class UnitReportTable extends SpreadsheetDatabaseTable<UnitReportSchema, "reportId"> {
    public constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
        const schema = new GenericDatabaseTableSchema(UnitReportSchema, ['reportId']);
        schema.primaryColumn = 'reportId';
        super(schema, sheet);
    }
}
