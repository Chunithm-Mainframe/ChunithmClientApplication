import { Difficulty } from "../../../Layer1/Difficulty";
import { BulkReportTable } from "./BulkReportTable";
import { BulkReportTableContainer } from "./BulkReportTableContainer";
import { BulkReportTableHeader } from "./BulkReportTableHeader";
import { BulkReportTableRow } from "./BulkReportTableRow";

export class BulkReportTableReader {
    public read(
        spreadsheetId: string,
        headerSheetName = 'header',
        basicSheetName = 'basic', advancedSheetName = 'advanced', expertSheetName = 'expert', masterSheetName = 'master'
    ): BulkReportTableContainer {
        const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
        if (!spreadsheet) {
            throw new Error(`Spreadsheet not found. (${spreadsheetId})`);
        }

        const header = this.createHeader(spreadsheet.getSheetByName(headerSheetName));
        const basicTable = this.createTable(header, spreadsheet, basicSheetName, Difficulty.Basic);
        const advancedTable = this.createTable(header, spreadsheet, advancedSheetName, Difficulty.Advanced);
        const exportTable = this.createTable(header, spreadsheet, expertSheetName, Difficulty.Expert);
        const masterTable = this.createTable(header, spreadsheet, masterSheetName, Difficulty.Master);

        const container = new BulkReportTableContainer();
        container.push(basicTable);
        container.push(advancedTable);
        container.push(exportTable);
        container.push(masterTable);
        return container;
    }

    private createHeader(sheet: GoogleAppsScript.Spreadsheet.Sheet): BulkReportTableHeader {
        const header = new BulkReportTableHeader();
        const values = sheet.getDataRange().getValues();
        for (const value of values.slice(1)) {
            header.push(value[0], value[1], value[2]);
        }
        return header;
    }

    private createTable(header: BulkReportTableHeader, spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet, sheetName: string, difficulty: Difficulty): BulkReportTable {
        const sheet = spreadsheet.getSheetByName(sheetName);
        const table = new BulkReportTable(header, sheetName, difficulty);
        const values = sheet.getDataRange().getValues();
        const oldColumnMap: { [key: string]: number } = {};
        for (const column of header.columns) {
            for (let i = 0; i < values[0].length; i++) {
                if (column.name === values[0][i]) {
                    oldColumnMap[column.name] = i;
                    break;
                }
            }
        }
        for (let i = 1; i < values.length; i++) {
            const row = new BulkReportTableRow(header);
            for (const column of header.columns) {
                const columnName = column.name;
                if (columnName in oldColumnMap) {
                    row.push(values[i][oldColumnMap[columnName]]);
                }
                else {
                    row.push('');
                }
            }
            table.push(row);
        }
        return table;
    }
}
