import { ReportForm, DoGet } from "./Product/ReportForm/ReportForm";

/* eslint @typescript-eslint/no-unused-vars: off */

const VERSION = "0.4.4";
export function getAppVersion(): string {
    return VERSION;
}

function doGet(e: DoGet) {
    return ReportForm.doGet(e);
}

function doPost(e: GoogleAppsScript.Events.DoPost) {
    return ReportForm.doPost(e);
}

function onPost(e, versionName: string) {
    ReportForm.onPost(e, versionName);
}

function onPostBulkReport(e, versionName: string) {
    ReportForm.onPostLevelBulkReport(e, versionName);
}

function onPostBulkReportImagePaths(e, versionName: string) {
    ReportForm.onPostBulkReportImagePaths(e, versionName);
}
