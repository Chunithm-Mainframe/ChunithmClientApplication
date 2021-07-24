import { ReportForm, DoGet } from "./Product/ReportForm/ReportForm";

const VERSION = "0.4.1.3";
export function getAppVersion(): string {
    return VERSION;
}

function doGet(e: DoGet): any {
    return ReportForm.doGet(e);
}

function doPost(e: GoogleAppsScript.Events.DoPost): any {
    return ReportForm.doPost(e);
}

function onPost(e: any, versionName: string) {
    ReportForm.onPost(e, versionName);
}

function onPostBulkReport(e: any, versionName: string) {
    ReportForm.onPostLevelBulkReport(e, versionName);
}

function onPostBulkReportImagePaths(e: any, versionName: string) {
    ReportForm.onPostBulkReportImagePaths(e, versionName);
}
