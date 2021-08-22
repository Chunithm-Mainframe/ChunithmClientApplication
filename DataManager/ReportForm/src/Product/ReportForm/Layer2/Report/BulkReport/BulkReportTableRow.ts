import { Difficulty } from "../../../Layer1/Difficulty";
import { ComboStatus } from "../../../Layer1/Rating";
import { MusicTable } from "../../Music/MusicTable";
import { Utility } from "../../Utility";
import { UnitReportInputFormat } from "../UnitReport/UnitReportInputFormat";
import { BulkReportTableHeader } from "./BulkReportTableHeader";
import { Music } from "../../Music/Music";

export class BulkReportTableRow implements UnitReportInputFormat {
    public static create(index: number, musicId: number, difficulty: Difficulty, header: BulkReportTableHeader, currentTable: MusicTable, previousTable: MusicTable = null): BulkReportTableRow {
        const row = new BulkReportTableRow(header);
        const musicData = currentTable.find({ id: musicId });
        const previousMusicData = previousTable ? previousTable.find({ id: musicId }) : null;
        for (const column of header.columns) {
            if (column.value.indexOf('@') !== 0) {
                row.push(column.value);
                continue;
            }

            if (column.value.indexOf('@input:') === 0) {
                row.push(column.value.replace('@input:', ''));
                continue;
            }

            switch (column.value) {
                case BulkReportTableHeader.VALUE_INDEX:
                    row.push(index);
                    break;
                case BulkReportTableHeader.VALUE_ID:
                    row.push(musicId);
                    break;
                case BulkReportTableHeader.VALUE_NAME:
                    row.push(musicData.name);
                    break;
                case BulkReportTableHeader.VALUE_GENRE:
                    row.push(musicData.genre);
                    break;
                case BulkReportTableHeader.VALUE_DIFFICULTY:
                    row.push(Utility.toDifficultyText(difficulty));
                    break;
                case BulkReportTableHeader.VALUE_LEVEL:
                    row.push(this.toLevelText(Music.getBaseRating(musicData, difficulty)));
                    break;
                case BulkReportTableHeader.VALUE_OP_BEFORE:
                    row.push(0);
                    break;
                case BulkReportTableHeader.VALUE_OP_AFTER:
                case BulkReportTableHeader.VALUE_SCORE:
                    row.push('');
                    break;
                case BulkReportTableHeader.VALUE_COMBO_STATUS:
                    row.push('None');
                    break;
                case BulkReportTableHeader.VALUE_PREV_BASE_RATING:
                    row.push(previousMusicData ? Music.getBaseRating(previousMusicData, difficulty) : '');
                    break;
            }
        }

        return row;
    }

    private static toLevelText(baseRating: number): string {
        const integerPart = Math.floor(baseRating);
        let levelText = integerPart.toString();
        if ((baseRating * 10) % 10 >= 7) {
            levelText += '+';
        }
        return levelText;
    }

    private _header: BulkReportTableHeader = null;
    private _values: (string | number | boolean)[] = [];

    public constructor(header: BulkReportTableHeader) {
        this._header = header;
    }

    public push(value: (string | number | boolean)): number {
        return this._values.push(value);
    }

    public get index(): number {
        return this.getValueByIndex(this.getColumnIndex(BulkReportTableHeader.VALUE_INDEX)) as number;
    }
    public get musicId(): number {
        return this.getValueByIndex(this.getColumnIndex(BulkReportTableHeader.VALUE_ID)) as number;
    }
    public get name(): string {
        return this.getValueByIndex(this.getColumnIndex(BulkReportTableHeader.VALUE_NAME)) as string;
    }
    public get genre(): string {
        return this.getValueByIndex(this.getColumnIndex(BulkReportTableHeader.VALUE_GENRE)) as string;
    }
    public get difficulty(): Difficulty {
        const difficultyText = this.getValueByIndex(this.getColumnIndex(BulkReportTableHeader.VALUE_DIFFICULTY)) as string;
        return Utility.toDifficulty(difficultyText);
    }
    public get level(): string {
        return this.getValueByIndex(this.getColumnIndex(BulkReportTableHeader.VALUE_LEVEL)) as string;
    }
    public get beforeOp(): number {
        return this.getValueByIndex(this.getColumnIndex(BulkReportTableHeader.VALUE_OP_BEFORE)) as number;
    }
    public get afterOp(): number {
        return this.getValueByIndex(this.getColumnIndex(BulkReportTableHeader.VALUE_OP_AFTER)) as number;
    }
    public get score(): number {
        return this.getValueByIndex(this.getColumnIndex(BulkReportTableHeader.VALUE_SCORE)) as number;
    }
    public get comboStatus(): ComboStatus {
        const comboStatusText = this.getValueByIndex(this.getColumnIndex(BulkReportTableHeader.VALUE_COMBO_STATUS)) as string;
        switch (comboStatusText) {
            case 'AJC':
            case 'AJ':
                return ComboStatus.AllJustice;
            case 'FC':
                return ComboStatus.FullCombo;
        }
        return ComboStatus.None;
    }

    private getColumnIndex(value: string): number {
        return this._header.getColumnIndexByValue(value);
    }

    public getValueByIndex(index: number): (string | number | boolean) {
        return this._values[index];
    }
    public getValueByColumnName(columnName: string): (string | number | boolean) {
        return this._values[this._header.getColumnIndexByName(columnName)];
    }

    public update(index: number, difficulty: Difficulty, newTable: MusicTable, oldTable: MusicTable = null): void {
        const musicId = this.musicId;
        const music = newTable.find({ id: musicId });
        const oldMusicData = oldTable ? oldTable.find({ id: musicId }) : null;
        for (let i = 0; i < this._header.columns.length; i++) {
            const column = this._header.columns[i];

            if (column.value.indexOf('@') !== 0) {
                this._values[i] = column.value;
                continue;
            }

            if (column.value.indexOf('@input:') === 0) {
                if (!this._values[i]) {
                    this._values[i] = column.value.replace('@input:', '');
                }
                continue;
            }

            switch (column.value) {
                case BulkReportTableHeader.VALUE_INDEX:
                    this._values[i] = index;
                    break;
                case BulkReportTableHeader.VALUE_NAME:
                    this._values[i] = music.name;
                    break;
                case BulkReportTableHeader.VALUE_GENRE:
                    this._values[i] = music.genre;
                    break;
                case BulkReportTableHeader.VALUE_DIFFICULTY:
                    this._values[i] = Utility.toDifficultyText(difficulty);
                    break;
                case BulkReportTableHeader.VALUE_LEVEL:
                    this._values[i] = BulkReportTableRow.toLevelText(Music.getBaseRating(music, difficulty));
                    break;
                case BulkReportTableHeader.VALUE_PREV_BASE_RATING:
                    this._values[i] = oldMusicData ? Music.getBaseRating(oldMusicData, difficulty) : '';
                    break;
            }
        }
    }

    public getRawValues(): (string | number | boolean)[] {
        const values = [];
        const columns = this._header.columns;
        for (let i = 0; i < columns.length; i++) {
            switch (columns[i].value) {
                case '@name':
                case '@level':
                    values.push(`'${this._values[i]}`);
                    break;
                default:
                    values.push(this._values[i]);
                    break;
            }
        }
        return values;
    }

    public isValid(): boolean {
        return this.score > 0 && this.beforeOp >= 0 && this.afterOp > 0;
    }
}
