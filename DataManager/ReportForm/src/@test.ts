import { Instance } from "./Product/ReportForm/Instance";
import { MusicModule } from "./Product/ReportForm/Layer2/Modules/MusicModule";
import { RatingDataAnalysisModule } from "./Product/ReportForm/Layer2/Modules/RatingDataAnalysisModule";
import { ReportModule } from "./Product/ReportForm/Layer2/Modules/Report/ReportModule";
import { UnitReport } from "./Product/ReportForm/Layer2/Report/UnitReport/UnitReport";
import { ReportForm } from "./Product/ReportForm/ReportForm";

// implements test core here
function checkInitialize() {
    console.time("checkInitialize");
    Instance.initialize();
    console.timeEnd("checkInitialize");
}

function doGetTest() {
    const e = {
        contentLength: -1,
        pathInfo: "Dev4",
        contextPath: "",
        queryString: "",
        parameters: {},
        parameter: {
            versionName: null
        },
    };

    ReportForm.doGet(e);
}

function writeRatingDataTest() {
    Instance.initialize();
    Instance.instance.module.getModule(RatingDataAnalysisModule).test();
}

function updateReportRepositoryTest() {

    function createUnitReport(musicId: number, musicName: string) {
        const unitReport = new UnitReport();
        unitReport.musicId = musicId;
        unitReport.musicName = musicName;
        return unitReport;
    }

    Instance.initialize();

    const versionName = Instance.instance.config.defaultVersionName;
    const table = Instance.instance.module.getModule(ReportModule).getUnitReportTable(versionName);

    const ret = table.update([
        createUnitReport(100, 'Hoge'),
        createUnitReport(101, 'HogeHoge'),
        createUnitReport(102, 'Fuga'),
    ]);

    console.log(ret);
}

function test_loadMusicTable() {
    Instance.initialize();

    const versionName = Instance.instance.config.defaultVersionName;
    const musicTable = Instance.instance.module.getModule(MusicModule).getMusicTable(versionName);
    console.log(musicTable.records.length);
}

function test_loadUnitReportTable() {
    Instance.initialize();
    const versionName = Instance.instance.config.defaultVersionName;
    const reportTable = Instance.instance.module.getModule(ReportModule).getUnitReportTable(versionName);
    console.log(reportTable.records.length);
}

function test_loadLevelReportTable() {
    Instance.initialize();
    const versionName = Instance.instance.config.defaultVersionName;
    const reportTable = Instance.instance.module.getModule(ReportModule).getLevelReportTable(versionName);
    console.log(reportTable.records.length);
}

function test_loadMusicReportGroup() {
    Instance.initialize();
    const versionName = Instance.instance.config.defaultVersionName;
    const table = Instance.instance.module.getModule(ReportModule).getMasterUnitReportGroupTable(versionName);
    console.log(table.records.length);
}

function test_searchMusic() {
    const targetMusicName = "ってゐ！ ～えいえんてゐVer～";

    Instance.initialize();
    const versionName = Instance.instance.config.defaultVersionName;
    const table = Instance.instance.module.getModule(MusicModule).getMusicTable(versionName);
    const music = table.getByName(targetMusicName);
    console.log(music);
}
