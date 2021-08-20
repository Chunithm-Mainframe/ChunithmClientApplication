import { noticeApprovedLevelReports, noticeApprovedUnitReports, noticeCreatedLevelReports, noticeCreatedUnitReports, noticeRejectedLevelReports, noticeRejectedUnitReports, notifyUnverified } from "./@operations";

/* eslint @typescript-eslint/no-unused-vars: off */

function onNotifyUnverified() {
    const now = new Date();
    const hours = now.getHours();
    if (hours === 9 || hours === 17) {
        notifyUnverified();
    }
}

function onNoticeCreatedUnitReports() {
    noticeCreatedUnitReports();
}

function onNoticeApprovedUnitReports() {
    noticeApprovedUnitReports();
}

function onNoticeRejectedUnitReports() {
    noticeRejectedUnitReports();
}

function onNoticeCreatedLevelReports() {
    noticeCreatedLevelReports();
}

function onNoticeApprovedLevelReports() {
    noticeApprovedLevelReports();
}

function onNoticeRejectedLevelReports() {
    noticeRejectedLevelReports();
}
