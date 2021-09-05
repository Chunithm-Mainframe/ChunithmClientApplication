import { Instance } from "./Product/ReportForm/Instance";
import { Difficulty } from "./Product/ReportForm/Layer1/Difficulty";
import { MusicRating } from "./Product/ReportForm/Layer2/PlayerRating/MusicRating";
import { PlayerRating } from "./Product/ReportForm/Layer2/PlayerRating/PlayerRating";
import { PlayerRatingModule } from "./Product/ReportForm/Layer3/Modules/PlayerRatingModule";

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

