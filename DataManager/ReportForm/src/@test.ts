import { Instance } from "./Product/ReportForm/Instance";
import { MusicModule } from "./Product/ReportForm/Layer2/Modules/MusicModule";
import { RatingDataAnalysisModule } from "./Product/ReportForm/Layer2/Modules/RatingDataAnalysisModule";
import { Music } from "./Product/ReportForm/Layer2/Music/Music";
import { MusicRepository } from "./Product/ReportForm/Layer2/Music/MusicRepository";
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

function writingTableTest() {
    const spreadsheetId = '1PCZ33KHTKDrfpVbmXp7h0YTSK5cDqaNVSCFE43a54qg';
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);

    console.time('total');

    console.time('music');
    const repo = new MusicRepository(spreadsheet.getSheetByName('Music'));
    repo.initialize();
    console.timeEnd('music');

    console.timeEnd('total');
}

function createMusic(id: number, name: string, genre: string) {
    return new Music()
        .apply('id', id)
        .apply('name', name)
        .apply('genre', genre);
}

function updateTableTest() {
    const spreadsheetId = '1PCZ33KHTKDrfpVbmXp7h0YTSK5cDqaNVSCFE43a54qg';
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);

    Instance.initialize();
    const module = Instance.instance.module.getModule(MusicModule);
    const repository = new MusicRepository(spreadsheet.getSheetByName('Music'));
    repository.initialize();
    const ret = module.updateRepository(repository, [
        createMusic(10001, 'Hoge', 'HogeHoge'),
        createMusic(10002, 'Fuga', 'FugaFuga'),
    ]);
    console.log(ret.added);
    console.log(ret.deleted);
}
