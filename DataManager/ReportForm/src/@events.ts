import { Operations } from "./Product/ReportForm/Layer4/Operations";

/* eslint @typescript-eslint/no-unused-vars: off */

function onNotifyUnverified() {
    const now = new Date();
    const hours = now.getHours();
    if (hours === 9 || hours === 17) {
        Operations.notifyUnverified();
    }
}

function onNoticeUpdateMusics() {
    Operations.noticeUpdateMusics();
}

function onNoticeCreatedUnitReports() {
    Operations.noticeCreatedUnitReports();
}

function onNoticeApprovedUnitReports() {
    Operations.noticeApprovedUnitReports();
}

function onNoticeRejectedUnitReports() {
    Operations.noticeRejectedUnitReports();
}

function onNoticeCreatedLevelReports() {
    Operations.noticeCreatedLevelReports();
}

function onNoticeApprovedLevelReports() {
    Operations.noticeApprovedLevelReports();
}

function onNoticeRejectedLevelReports() {
    Operations.noticeRejectedLevelReports();
}

function onFetchMusicJson() {
    Operations.fetchMusicJson();
}
