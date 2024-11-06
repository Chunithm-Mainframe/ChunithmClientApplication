class UnitReportTable extends SpreadsheetDatabaseTable<UnitReport, "reportId"> {
    public constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
        const schema = new GenericDatabaseTableSchema(UnitReport, ['reportId']);
        schema.primaryColumn = 'reportId';
        super(schema, sheet);
    }

    public static instantiateRecordByRawReport(value: UnitReportSchema): UnitReport {
        const report = new UnitReport();
        report.musicId = value.musicId;
        report.musicName = value.musicName;
        report.difficulty = value.difficulty;
        report.beforeOp = value.beforeOp;
        report.afterOp = value.afterOp;
        report.score = value.score;
        report.comboStatus = value.comboStatus;
        report.imagePathText = value.imagePaths?.join(',');
        return report;
    }
}
