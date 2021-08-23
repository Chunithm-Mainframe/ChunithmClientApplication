import { LogLevel } from "../../../../Packages/CustomLogger/CustomLogger";
export class SpreadsheetLog {
    public id = 0;
    public threadId = 0;
    public logLevel: LogLevel = LogLevel.Debug;
    public userAgent = '';
    public message = '';
}
