import { GenericDatabaseTableSchema } from "../../../../Packages/Database/GenericDatabaseSchema";
import { SpreadsheetDatabaseTable } from "../../../../Packages/Database/SpreadsheetDatabaseTable";
import { PlayerRating } from "./PlayerRating";


export class PlayerRatingTable extends SpreadsheetDatabaseTable<PlayerRating, "id">
{
    public constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
        super(new GenericDatabaseTableSchema(PlayerRating, ["id"]), sheet);
    }
}
