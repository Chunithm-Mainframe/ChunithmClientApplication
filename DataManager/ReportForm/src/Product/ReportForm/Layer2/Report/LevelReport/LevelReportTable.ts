import { SpreadsheetDatabaseTable } from "../../../../../Packages/Repository/SpreadsheetDatabaseTable";
import { GenericDatabaseTableSchema } from "../../../../../Packages/Repository/GenericDatabaseSchema";
import { LevelReport } from "./LevelReport";
import { ReportStatus } from "../ReportStatus";
import { LevelRawReport } from "./LevelRawReport";

export class LevelReportTable extends SpreadsheetDatabaseTable<LevelReport, 'reportId'> {
    public constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
        const schema = new GenericDatabaseTableSchema(LevelReport, ['reportId']);
        schema.primaryColumn = 'reportId';
        super(schema, sheet);
    }

    public static instantiateRecord(rawReport: LevelRawReport, musicCount: number): LevelReport {
        const instance = new LevelReport();
        instance.level = rawReport.targetLevel;
        instance.musicCount = musicCount;
        instance.op = rawReport.op;
        instance.opRatio = rawReport.opRatio;
        instance.imagePathText = rawReport.imagePaths.join(',');
        instance.reportStatus = ReportStatus.InProgress;
        return instance;
    }
}
