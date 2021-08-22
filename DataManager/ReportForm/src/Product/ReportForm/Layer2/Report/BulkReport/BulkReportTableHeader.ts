export class BulkReportTableHeader {
    public static readonly VALUE_INDEX = '@index';
    public static readonly VALUE_ID = '@id';
    public static readonly VALUE_NAME = '@name';
    public static readonly VALUE_GENRE = '@genre';
    public static readonly VALUE_DIFFICULTY = '@difficulty';
    public static readonly VALUE_LEVEL = '@level';
    public static readonly VALUE_OP_BEFORE = '@opBefore';
    public static readonly VALUE_OP_AFTER = '@opAfter';
    public static readonly VALUE_SCORE = '@score';
    public static readonly VALUE_COMBO_STATUS = '@comboStatus';
    public static readonly VALUE_PREV_BASE_RATING = '@previousBaseRating';

    private _columnIndexByNameMap: {
        [key: string]: number;
    } = {};
    private _columnIndexByValueMap: {
        [key: string]: number;
    } = {};
    private _columns: {
        name: string;
        value: string;
        protect: boolean;
    }[] = [];

    public push(name: string, value: string, protect: boolean) {
        const length = this._columns.push({ name: name, value: value, protect: protect });
        this._columnIndexByNameMap[name] = length - 1;
        if (value.indexOf('@') === 0 && value.indexOf('@input') !== 0) {
            this._columnIndexByValueMap[value] = length - 1;
        }
    }

    public get columns(): { name: string; value: string; protect: boolean }[] {
        return this._columns;
    }

    public getColumnIndexByName(name: string): number {
        return this._columnIndexByNameMap[name];
    }
    public getColumnIndexByValue(value: string): number {
        return this._columnIndexByValueMap[value];
    }

    public getColumnNameByValue(value: string): string {
        return this._columns[this._columnIndexByValueMap[value]].name;
    }
    public getValueByColumnName(name: string): string {
        return this._columns[this._columnIndexByNameMap[name]].value;
    }
}
