import { GenericDatabaseTableSchema } from "../../../../Packages/Database/GenericDatabaseSchema";
import { SpreadsheetDatabaseTable } from "../../../../Packages/Database/SpreadsheetDatabaseTable";
import { Music } from "./Music";

export class MusicTable extends SpreadsheetDatabaseTable<Music, 'id'> {
    public constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
        super(new GenericDatabaseTableSchema(Music, ["id"]), sheet);
    }

    public getByName(name: string): Music {
        return this.records.find(x => x.name === name);
    }

    // Lv.1-6の楽曲数取得用
    public getTargetLowLevelMusicCount(targetLevel: number): number {
        let count = 0;
        for (const row of this.records) {
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
