import { CustomLogger, LogLevel } from "../../../../Packages/CustomLogger/CustomLogger";
import { DatabaseTable } from "../../../../Packages/Repository/DatabaseTable";
import { GenericDatabaseTableSchema } from "../../../../Packages/Repository/GenericDatabaseSchema";
import { SpreadsheetDatabaseTable } from "../../../../Packages/Repository/SpreadsheetDatabaseTable";
import { SpreadsheetLog } from "./SpreadsheetLog";

type LogTable = DatabaseTable<SpreadsheetLog, 'id'>;

export class SpreadsheetLogger implements CustomLogger {
    private readonly _threadId: number;

    private _spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet;

    private _debugLogTable: LogTable;
    private _infoLogTable: LogTable;
    private _warningLogTable: LogTable;
    private _errorLogTable: LogTable;

    public constructor(
        private readonly _spreadsheetId: string,
        private readonly _debugSheetName: string,
        private readonly _infoSheetName: string,
        private readonly _warningSheetName: string,
        private readonly _errorSheetName: string) {
        const min = 100000;
        const max = 999999;
        this._threadId = Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private getSpreadsheet() {
        if (!this._spreadsheetId) {
            return null;
        }
        if (!this._spreadsheet) {
            this._spreadsheet = SpreadsheetApp.openById(this._spreadsheetId);
        }
        return this._spreadsheet;
    }

    private getLogTable(level: LogLevel) {
        switch (level) {
            case LogLevel.Debug:
                return this.getDebugLogTable();
            case LogLevel.Info:
                return this.getInfoLogTable();
            case LogLevel.Warning:
                return this.getWarningLogTable();
            case LogLevel.Error:
                return this.getErrorLogTable();
        }
    }

    private getDebugLogTable() {
        this._debugLogTable = this.getOrCreateLogTable(this._debugLogTable, this._debugSheetName);
        return this._debugLogTable;
    }
    private getInfoLogTable() {
        this._infoLogTable = this.getOrCreateLogTable(this._infoLogTable, this._infoSheetName);
        return this._infoLogTable;
    }
    private getWarningLogTable() {
        this._warningLogTable = this.getOrCreateLogTable(this._warningLogTable, this._warningSheetName);
        return this._warningLogTable;
    }
    private getErrorLogTable() {
        this._errorLogTable = this.getOrCreateLogTable(this._errorLogTable, this._errorSheetName);
        return this._errorLogTable;
    }
    private getOrCreateLogTable(table: DatabaseTable<SpreadsheetLog, 'id'>, sheetName: string) {
        if (table) {
            return table;
        }
        if (!sheetName) {
            return null;
        }
        const sheet = this.getSpreadsheet?.().getSheetByName?.(sheetName);
        if (!sheet) {
            return null;
        }
        const schema = new GenericDatabaseTableSchema(SpreadsheetLog, ['id']);
        schema.primaryColumn = 'id';
        return new SpreadsheetDatabaseTable(schema, sheet);
    }

    public log(level: LogLevel, message): void {
        const table = this.getLogTable(level);
        if (!table) {
            return;
        }

        const log = new SpreadsheetLog();
        log.threadId = this._threadId;
        log.logLevel = level;
        log.userAgent = HtmlService.getUserAgent();
        log.message = message;
        table.update(log);
    }

    public exception(error: Error): void {
        const table = this.getErrorLogTable();
        if (!table) {
            return;
        }

        const log = new SpreadsheetLog();
        log.threadId = this._threadId;
        log.logLevel = LogLevel.Error;
        log.userAgent = HtmlService.getUserAgent();
        log.message = error.message;
    }
}
