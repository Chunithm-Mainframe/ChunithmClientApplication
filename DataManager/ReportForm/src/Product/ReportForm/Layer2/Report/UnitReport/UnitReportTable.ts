import { GenericDatabaseTableSchema } from "../../../../../Packages/Database/GenericDatabaseSchema";
import { SpreadsheetDatabaseTable } from "../../../../../Packages/Database/SpreadsheetDatabaseTable";
import { UnitReport } from "./UnitReport";
import { UnitRawReport } from "./UnitRawReport";

export class UnitReportTable extends SpreadsheetDatabaseTable<UnitReport, "reportId"> {
    public constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
        const schema = new GenericDatabaseTableSchema(UnitReport, ['reportId']);
        schema.primaryColumn = 'reportId';
        super(schema, sheet);
    }

    public static instantiateRecord(value: Partial<UnitReport>): UnitReport {
        const instance = new UnitReport();
        for (const key of Object.keys(instance)) {
            instance[key] = value[key];
        }
        return instance;
    }

    public static instantiateRecordByRawReport(rawReport: UnitRawReport): UnitReport {
        const report = new UnitReport();
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
