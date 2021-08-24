import { execute, noticeCreatedUnitReports } from "./@operations";
import { Instance } from "./Product/ReportForm/Instance";
import { RatingDataAnalysisModule } from "./Product/ReportForm/Layer3/Modules/RatingDataAnalysisModule";
import { ReportModule } from "./Product/ReportForm/Layer3/Modules/Report/ReportModule";
import { VersionModule } from "./Product/ReportForm/Layer3/Modules/VersionModule";

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

function test_iterateFormListItems() {
    Instance.initialize();
    const obj = Instance.instance;

    const form = obj.module.getModule(ReportModule).unitReportGroupByGenreGoogleForm;
    const list = form.getItems(FormApp.ItemType.LIST);

    const genres = obj.module.getModule(VersionModule)
        .getVersionConfig(obj.config.defaultVersionName)
        .genres;

    console.log(genres);
    for (let i = 0; i < genres.length; i++) {
        const genre = genres[i];
        const musicList = list[i + 1];
        console.log(`${genre}:${musicList}`);
        console.log(musicList?.asListItem?.().getTitle?.());
    }
}

function test_updateMusicsUnitReportForm() {
    Instance.initialize();
    Instance.instance.module.getModule(ReportModule).updateMusicsUnitReportForm(
        Instance.instance.config.defaultVersionName);
}

function test_driveImageUrl() {
    const response = UrlFetchApp.fetch('https://drive.google.com/uc?id=1iSM6WkeUuJFYx10HpGUqnMvBdvHrOjy5', { followRedirects: false, muteHttpExceptions: false });
    console.log(response.getHeaders()['Location']);
}
