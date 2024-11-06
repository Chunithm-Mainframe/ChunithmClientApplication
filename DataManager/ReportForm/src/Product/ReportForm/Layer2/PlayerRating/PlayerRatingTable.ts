class PlayerRatingTable extends SpreadsheetDatabaseTable<PlayerRating, "id">
{
    public constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
        super(new GenericDatabaseTableSchema(PlayerRating, ["id"]), sheet);
    }
}
