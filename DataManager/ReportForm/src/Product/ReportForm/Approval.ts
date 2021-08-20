import { Instance } from "./Instance";
import { ApprovalError, ApprovalModule } from "./Layer3/Modules/ApprovalModule";

// eslint-disable-next-line
function approve(reportIdText: string, versionName: string): void {
    try {
        Instance.initialize();
        if (!versionName) {
            throw new ApprovalError(`バージョン名未指定.`);
        }
        const reportId = parseInt(reportIdText);
        Instance.instance.module.getModule(ApprovalModule).approveUnitReport(versionName, reportId);
    }
    catch (error) {
        Instance.exception(error);
    }
}

// eslint-disable-next-line
function reject(reportIdText: string, versionName: string): void {
    try {
        Instance.initialize();
        if (!versionName) {
            throw new ApprovalError(`バージョン名未指定.`);
        }
        const reportId = parseInt(reportIdText);
        Instance.instance.module.getModule(ApprovalModule).rejectUnitReport(versionName, reportId);
    }
    catch (error) {
        Instance.exception(error);
    }
}

// eslint-disable-next-line
function groupApprove(reportGroupId: string, versionName: string): void {
    try {
        Instance.initialize();
        if (!versionName) {
            throw new ApprovalError(`バージョン名未指定.`);
        }
        Instance.instance.module.getModule(ApprovalModule).approveUnitReportGroup(versionName, reportGroupId);
    }
    catch (error) {
        Instance.exception(error);
    }
}

// eslint-disable-next-line
function bulkApprove(reportIdText: string, versionName: string): void {
    try {
        Instance.initialize();
        if (!versionName) {
            throw new ApprovalError(`バージョン名未指定.`);
        }
        const reportId = parseInt(reportIdText);
        Instance.instance.module.getModule(ApprovalModule).approveLevelReport(versionName, reportId);
    }
    catch (error) {
        Instance.exception(error);
    }
}

// eslint-disable-next-line
function bulkReject(reportIdText: string, versionName: string): void {
    try {
        Instance.initialize();
        if (!versionName) {
            throw new ApprovalError(`バージョン名未指定.`);
        }
        const reportId = parseInt(reportIdText);
        Instance.instance.module.getModule(ApprovalModule).rejectLevelReport(versionName, reportId);
    }
    catch (error) {
        Instance.exception(error);
    }
}
