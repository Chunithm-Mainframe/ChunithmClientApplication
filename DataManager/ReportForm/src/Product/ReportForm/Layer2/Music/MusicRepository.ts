import { GenericSchema } from "../../../../Packages/Repository/GenericSchema";
import { SpreadsheetRepository } from "../../../../Packages/Repository/SpreadsheetRepository";
import { Music } from "./Music";

export class MusicRepository extends SpreadsheetRepository<GenericSchema<Music, "id"[]>> {
    public constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
        super(sheet, new GenericSchema(Music, ["id"]));
    }
}
