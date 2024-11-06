class MasterUnitReportGroupTable extends SpreadsheetDatabaseTable<MasterUnitRecordGroup, 'groupId' | 'musicId' | 'difficulty'> {
    public constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
        const schema = new GenericDatabaseTableSchema(MasterUnitRecordGroup, ['groupId', 'musicId', 'difficulty']);
        super(schema, sheet);
    }
}
