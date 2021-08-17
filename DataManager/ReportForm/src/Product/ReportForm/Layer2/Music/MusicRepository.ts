import { GenericSchema } from "../../../../Packages/Repository/GenericSchema";
import { SpreadsheetRepository } from "../../../../Packages/Repository/SpreadsheetRepository";
import { Music } from "./Music";

export class MusicRepository extends SpreadsheetRepository<GenericSchema<Music, "id"[]>> {
    public constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
        super(sheet, new GenericSchema(Music, ["id"]));
    }

    public getByName(name: string): Music {
        return this.rows.find(x => x.name === name);
    }

    // Lv.1-6の楽曲数取得用
    public getTargetLowLevelMusicCount(targetLevel: number): number {
        let count = 0;
        for (const row of this.rows) {
            if (row.basicBaseRating === targetLevel) {
                count++;
            }
            if (row.advancedBaseRating === targetLevel) {
                count++;
            }
        }
        return count;
    }
}
