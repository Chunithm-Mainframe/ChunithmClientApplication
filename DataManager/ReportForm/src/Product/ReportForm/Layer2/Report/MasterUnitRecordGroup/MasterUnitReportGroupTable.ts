import { SpreadsheetDatabaseTable } from "../../../../../Packages/Database/SpreadsheetDatabaseTable";
import { GenericDatabaseTableSchema } from "../../../../../Packages/Database/GenericDatabaseSchema";
import { MasterUnitRecordGroup } from "./MasterUnitRecordGroup";
export class MasterUnitReportGroupTable extends SpreadsheetDatabaseTable<MasterUnitRecordGroup, 'groupId' | 'musicId' | 'difficulty'> {
    public constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
        const schema = new GenericDatabaseTableSchema(MasterUnitRecordGroup, ['groupId', 'musicId', 'difficulty']);
        super(schema, sheet);
    }
    //public getByGroupId(groupId: string): MasterUnitRecordGroup[] {
    //    return this.records.filter(x => x.groupId === groupId);
    //}
    //public groupByGroupId(): {
    //    groupId: string;
    //    records: MasterUnitRecordGroup[];
    //}[] {
    //    const map: Record<string, MasterUnitRecordGroup[]> = {};
    //    for (const record of this.records) {
    //        if (!(record.groupId in map)) {
    //            map[record.groupId] = [];
    //        }
    //        map[record.groupId].push(record);
    //    }
    //    return Object.keys(map).map(x => {
    //        return {
    //            groupId: x,
    //            records: map[x],
    //        };
    //    });
    //}
}
