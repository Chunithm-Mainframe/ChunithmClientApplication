import { GenericDatabaseTableSchema } from "../../../../Packages/Repository/GenericDatabaseSchema";
import { SpreadsheetDatabaseTable } from "../../../../Packages/Repository/SpreadsheetDatabaseTable";
import { PlayerRating } from "./PlayerRating";


export class PlayerRatingTable extends SpreadsheetDatabaseTable<PlayerRating, "id">
{
    public constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
        super(new GenericDatabaseTableSchema(PlayerRating, ["id"]), sheet);
    }
}
