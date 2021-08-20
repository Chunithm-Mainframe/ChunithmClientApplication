import { execute, noticeCreatedUnitReports } from "./@operations";
import { Instance } from "./Product/ReportForm/Instance";
import { RatingDataAnalysisModule } from "./Product/ReportForm/Layer3/Modules/RatingDataAnalysisModule";

/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/camelcase: off */

// implements test core here

function writeRatingDataTest() {
    Instance.initialize();
    Instance.instance.module.getModule(RatingDataAnalysisModule).test();
}

function test_noticeReport() {
    execute(instance => {
        const versionName = instance.config.defaultVersionName;
        instance.noticeManager.noticeCreateUnitReport(versionName, [4, 5, 6, 7, 8]);
    });
}

function test_pushNotice() {
    const noticeQueue = Instance.getNoticeQueue();
    noticeQueue.enqueueCreateUnitReport(4);
    noticeQueue.save();

    noticeCreatedUnitReports();
}
