import { Instance } from "./Product/ReportForm/Instance";
import { RatingDataAnalysisModule } from "./Product/ReportForm/Layer2/Modules/RatingDataAnalysisModule";
import { UnitReportTable, UnitReportSchema } from "./Product/ReportForm/Layer2/Report/UnitReport/UnitReportRepository";
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

    function createUnitReport(reportId: number, musicId: number, musicName: string) {
        const unitReport = new UnitReportSchema();
        unitReport.reportId = reportId;
        unitReport.musicId = musicId;
        unitReport.musicName = musicName;
        return unitReport;
    }

    const sheetId = '1Nky3XwdpIxuOO6VXNtrOoyfRIcFAnC8ADzut3Io9cCM';
    const sheet = SpreadsheetApp.openById(sheetId);

    const table = new UnitReportTable(sheet.getSheetByName('UnitReport'));
    const ret = table.update([
        createUnitReport(1000, 100, 'Hoge'),
        createUnitReport(1001, 101, 'HogeHoge'),
        createUnitReport(1002, 102, 'Fuga'),
    ]);

    console.log(ret);
}
