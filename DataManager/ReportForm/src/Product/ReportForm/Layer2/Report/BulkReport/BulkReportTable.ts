import { Difficulty } from "../../../Layer1/Difficulty";
import { MusicTable } from "../../Music/MusicTable";
import { BulkReportTableHeader } from "./BulkReportTableHeader";
import { BulkReportTableRow } from "./BulkReportTableRow";

export class BulkReportTable {
    private _rows: BulkReportTableRow[] = [];
    private _idMap: { [key: number]: number } = {};

    public constructor(private readonly _header: BulkReportTableHeader, private readonly _tableName: string, private readonly _difficulty: Difficulty) {
    }

    public push(row: BulkReportTableRow): number {
        const length = this._rows.push(row);
        this._idMap[row.musicId] = length - 1;
        return length;
    }

    public get tableName(): string {
        return this._tableName;
    }
    public get difficluty(): Difficulty {
        return this._difficulty;
    }
    public get header(): BulkReportTableHeader {
        return this._header;
    }
    public get rows(): BulkReportTableRow[] {
        return this._rows.slice();
    }

    public getRowByMusicId(musicId: number): BulkReportTableRow {
        if (musicId in this._idMap) {
            return this._rows[this._idMap[musicId]];
        }
        return null;
    }

    public updateMusicDataTable(newTable: MusicTable, oldTable: MusicTable = null): void {
        const newMusics = newTable.records;
        const oldRows = this._rows;
        const oldIdMap = this._idMap;
        this._rows = [];
        this._idMap = {};
        for (let i = 0; i < newMusics.length; i++) {
            const musicId = newMusics[i].id;
            if (musicId in oldIdMap) {
                const row = oldRows[oldIdMap[musicId]];
                row.update(i + 1, this._difficulty, newTable, oldTable);
                this.push(row);
            }
            else {
                const row = BulkReportTableRow.create(i + 1, musicId, this._difficulty, this._header, newTable, oldTable);
                this.push(row);
            }
        }
    }
}
