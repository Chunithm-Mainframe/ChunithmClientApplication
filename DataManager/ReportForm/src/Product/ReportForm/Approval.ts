import { Instance } from "./Instance";
import { ApprovalError, ApprovalModule } from "./Layer3/Modules/ApprovalModule";

function approve(reportIdText: string, versionName: string): void {
    try {
        Instance.initialize();
        if (!versionName) {
            throw new ApprovalError(`バージョン名未指定.`);
        }
        let reportId = parseInt(reportIdText);
        Instance.instance.module.getModule(ApprovalModule).approve(versionName, reportId);
    }
    catch (error) {
        Instance.exception(error);
    }
}

function reject(reportIdText: string, versionName: string): void {
    try {
        Instance.initialize();
        if (!versionName) {
            throw new ApprovalError(`バージョン名未指定.`);
        }
        let reportId = parseInt(reportIdText);
        Instance.instance.module.getModule(ApprovalModule).reject(versionName, reportId);
    }
    catch (error) {
        Instance.exception(error);
    }
}

function groupApprove(reportGroupId: string, versionName: string): void {
    try {
        Instance.initialize();
        if (!versionName) {
            throw new ApprovalError(`バージョン名未指定.`);
        }
        Instance.instance.module.getModule(ApprovalModule).approveGroup(versionName, reportGroupId);
    }
    catch (error) {
        Instance.exception(error);
    }
}

function bulkApprove(reportIdText: string, versionName: string): void {
    try {
        Instance.initialize();
        if (!versionName) {
            throw new ApprovalError(`バージョン名未指定.`);
        }
        let reportId = parseInt(reportIdText);
        Instance.instance.module.getModule(ApprovalModule).bulkApprove(versionName, reportId);
    }
    catch (error) {
        Instance.exception(error);
    }
}

function bulkReject(reportIdText: string, versionName: string): void {
    try {
        Instance.initialize();
        if (!versionName) {
            throw new ApprovalError(`バージョン名未指定.`);
        }
        let reportId = parseInt(reportIdText);
        Instance.instance.module.getModule(ApprovalModule).bulkReject(versionName, reportId);
    }
    catch (error) {
        Instance.exception(error);
    }
}
