export class SpreadsheetLogger {
    private _log: LogSheet;
    private _warning: LogSheet;
    private _error: LogSheet;

    private threadId: string;

    public constructor(log: LogSheet, warning: LogSheet, error: LogSheet) {
        this._log = log;
        this._warning = warning;
        this._error = error;

        this.threadId = SpreadsheetLogger.getThreadId().toString();
    }

    private static getThreadId(): number {
        const min = 100000;
        const max = 999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public get logSheet(): LogSheet {
        return this._log;
    }
    public get warningSheet(): LogSheet {
        return this._warning;
    }
    public get errorSheet(): LogSheet {
        return this._error;
    }

    public log(message): void {
        if (this._log) {
            this._log.write([this.threadId, new Date().toString(), 'log', message]);
        }
    }
    public logWarning(message): void {
        if (this._warning) {
            this._warning.write([this.threadId, new Date().toString(), 'warning', message]);
        }
    }
    public logError(message): void {
        if (this._error) {
            this._error.write([this.threadId, new Date().toString(), 'error', message]);
        }
    }
}

export class LogSheet {
    private static logSheetMap: { [key: string]: LogSheet } = {};
    public static openLogSheet(spreadsheetId: string, worksheetName: string): LogSheet {
        const key = `${spreadsheetId}/${worksheetName}`;
        if (key in this.logSheetMap) {
            return this.logSheetMap[key];
        }
        const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
        const worksheet = spreadsheet.getSheetByName(worksheetName);
        if (!worksheet) {
            throw new Error(`worksheet is null. ${spreadsheet}:${worksheetName}`);
        }
        this.logSheetMap[key] = new LogSheet(worksheet);
        return this.logSheetMap[key];
    }

    private _worksheet: GoogleAppsScript.Spreadsheet.Sheet;
    private _currentRow: number;
    private constructor(worksheet: GoogleAppsScript.Spreadsheet.Sheet) {
        this._worksheet = worksheet;
        this._currentRow = this._worksheet.getLastRow();
    }

    public write(messages: string[]): void {
        this._worksheet.getRange(this._currentRow + 1, 1, 1, messages.length).setValues([messages]);
        ++this._currentRow;
    }
}
