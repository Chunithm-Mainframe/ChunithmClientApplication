import { Instance } from "./Product/ReportForm/Instance";
import { Difficulty } from "./Product/ReportForm/Layer1/Difficulty";
import { MusicRating } from "./Product/ReportForm/Layer2/PlayerRating/MusicRating";
import { PlayerRating } from "./Product/ReportForm/Layer2/PlayerRating/PlayerRating";
import { ChunirecModule } from "./Product/ReportForm/Layer3/Modules/ChunirecModule";
import { PlayerRatingModule } from "./Product/ReportForm/Layer3/Modules/PlayerRatingModule";
import { NoticeManager } from "./Product/ReportForm/Layer4/Managers/NoticeManager";

/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/camelcase: off */

// implements test core here

function test_updatePlayerRatingTable() {
    function createMusicRating(id: number, difficulty: Difficulty, score: number): MusicRating {
        return {
            id: id,
            difficulty: difficulty,
            score: score,
        };
    }

    function createMusicRatings(count: number): MusicRating[] {
        const records: MusicRating[] = [];
        for (let i = 1; i <= count; i++) {
            records.push(createMusicRating(i, Difficulty.Invalid, 1010000));
        }
        return records;
    }

    function createRecord(id: number): PlayerRating {
        const record = new PlayerRating();
        record.id = id;
        record.setBest(createMusicRatings(30));
        record.setOutsideBest(createMusicRatings(10));
        record.setRecent(createMusicRatings(10));
        return record;
    }

    Instance.initialize();
    const playerRatingTable = Instance.instance.module.getModule(PlayerRatingModule)
        .getPlayerRatingTable(Instance.instance.config.defaultVersionName);

    const records: PlayerRating[] = [];
    for (let i = 1; i < 10; i++) {
        records.push(createRecord(i));
    }
    playerRatingTable.update(records);
}

function test_invokePlayerRatingGetPostCommand() {
    Instance.initialize();
    Instance.instance.setupPostCommands();
    const result = Instance.instance
        .postCommandManager
        .findPostCommand("playerRating/table/get")
        .invoke({ versionName: Instance.instance.config.defaultVersionName })
    console.log(result);
}

function test_getPlayerRating() {
    Instance.initialize();
    const module = Instance.instance.module.getModule(ChunirecModule);
    const result = module.requestPlayerRatings(1, 100);
    console.log(result);
}

function test_requestUpdateMusicAll() {
    Instance.initialize();
    const module = Instance.instance.module.getModule(ChunirecModule);

    const params = [
        { musicId: 180, difficulty: Difficulty.Master, baseRating: 14.1 },
        { musicId: 219, difficulty: Difficulty.Master, baseRating: 14.1 }];

    const result = module.requestUpdateMusicAll(params);
    console.log(result);
}

function test_enqueueApproveUnitReport() {
    Instance.initialize();
    for (let i = 0; i < 30; i++) {
        const reportId = i + 1;
        Instance.instance.noticeQueue.enqueueApproveUnitReport(reportId);
    }
    Instance.instance.noticeQueue.save();
}

function test_dumpTwitterMessage() {
    console.log(NoticeManager.getApprovedUnitReportTwitterMessage(
        'TEST MUSIC NAME',
        Difficulty.Master,
        15.2,
        'TEST VERSION NAME',
        new Date()));
}

function test_fetchMusicJson() {
    const response = UrlFetchApp.fetch("https://chunithm.sega.jp/storage/json/music_new.json");
    console.log(response.getContentText());
}
