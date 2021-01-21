import { GenericSchema } from "../../../../Packages/Repository/GenericSchema";
import { SpreadsheetRepository } from "../../../../Packages/Repository/SpreadsheetRepository";
import { ReportFormModule } from "./@ReportFormModule";

interface PlayRecord {
    readonly sort_num: number;
    readonly music_idx: number;
    readonly music_diff: string;
    readonly score: number;
}

interface PlayerRecord {
    readonly id: number;
    readonly best: PlayRecord[];
    readonly outside_best: PlayRecord[];
    readonly recent: PlayRecord[];
}

class PlayerRecordRepositoryRow {
    public id = 0;
    public best_json = "";
    public outside_best_json = "";
    public recent_json = "";
}

export class RatingDataAnalysisModule extends ReportFormModule {
    private createPlayRecord(sortNum: number, musicId: number, difficulty: string, score: number): PlayRecord {
        return {
            sort_num: sortNum,
            music_idx: musicId,
            music_diff: difficulty,
            score: score,
        };
    }

    private toRow(data: PlayerRecord): PlayerRecordRepositoryRow {
        const ret = new PlayerRecordRepositoryRow();
        ret.id = data.id;
        ret.best_json = JSON.stringify(data.best);
        ret.outside_best_json = JSON.stringify(data.outside_best);
        ret.recent_json = JSON.stringify(data.recent);
        return ret;
    }

    public test(): void {
        const data: PlayerRecord[] = [
            {
                id: 1,
                best: [
                    this.createPlayRecord(1, 1, "ADV", 1010000),
                    this.createPlayRecord(1, 1, "EXP", 1010000),
                ],
                outside_best: [
                    this.createPlayRecord(1, 1, "ADV", 1010000),
                    this.createPlayRecord(1, 1, "EXP", 1010000),
                ],
                recent: [
                    this.createPlayRecord(1, 1, "ADV", 1010000),
                    this.createPlayRecord(1, 1, "EXP", 1010000),
                ],
            },
            {
                id: 2,
                best: [
                    this.createPlayRecord(1, 1, "ADV", 1010000),
                    this.createPlayRecord(1, 2, "ADV", 1010000),
                ],
                outside_best: [
                    this.createPlayRecord(1, 1, "ADV", 1010000),
                    this.createPlayRecord(1, 2, "ADV", 1010000),
                ],
                recent: [
                    this.createPlayRecord(1, 1, "ADV", 1010000),
                    this.createPlayRecord(1, 2, "ADV", 1010000),
                ],
            }
        ]

        const version = this.configuration.defaultVersionName;
        const config = this.configuration.versions[version];

        const spreadsheet = SpreadsheetApp.openById(config.ratingDataForAnalysisSpreadsheetId);
        const worksheet = spreadsheet.getSheetByName(config.ratingDataForAnalysisWorksheetName);

        const rows = data.map(d => this.toRow(d));
        const schema = new GenericSchema(PlayerRecordRepositoryRow, ["id"]);
        const repository = new SpreadsheetRepository(worksheet, schema);
        repository.initialize();
        repository.update(rows);
    }
}
