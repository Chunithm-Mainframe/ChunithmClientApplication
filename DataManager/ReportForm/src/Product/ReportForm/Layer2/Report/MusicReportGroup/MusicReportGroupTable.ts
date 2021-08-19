import { SpreadsheetDatabaseTable } from "../../../../../Packages/Database/SpreadsheetDatabaseTable";
import { GenericDatabaseTableSchema } from "../../../../../Packages/Database/GenericDatabaseSchema";
import { MusicReportGroup } from "./MusicReportGroup";
export class MusicReportGroupTable extends SpreadsheetDatabaseTable<MusicReportGroup, 'groupId' | 'musicId' | 'difficulty'> {
    public constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
        const schema = new GenericDatabaseTableSchema(MusicReportGroup, ['groupId', 'musicId', 'difficulty']);
        super(schema, sheet);
    }
    public getByGroupId(groupId: string): MusicReportGroup[] {
        return this.records.filter(x => x.groupId === groupId);
    }

    public groupByGroupId(): { groupId: string; records: MusicReportGroup[] }[] {
        const map: Record<string, MusicReportGroup[]> = {};
        for (const record of this.records) {
            if (!(record.groupId in map)) {
                map[record.groupId] = [];
            }
            map[record.groupId].push(record);
        }
        return Object.keys(map).map(x => {
            return {
                groupId: x,
                records: map[x],
            };
        });
    }
}
