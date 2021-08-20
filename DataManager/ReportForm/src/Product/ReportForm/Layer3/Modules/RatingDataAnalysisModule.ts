import { GenericDatabaseTableSchema } from "../../../../Packages/Database/GenericDatabaseSchema";
import { SpreadsheetDatabaseTable } from "../../../../Packages/Database/SpreadsheetDatabaseTable";
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
        /* eslint-disable @typescript-eslint/camelcase */
        return {
            sort_num: sortNum,
            music_idx: musicId,
            music_diff: difficulty,
            score: score,
        };
        /* eslint-enable */
    }

    private toRow(data: PlayerRecord): PlayerRecordRepositoryRow {
        /* eslint-disable @typescript-eslint/camelcase */
        const ret = new PlayerRecordRepositoryRow();
        ret.id = data.id;
        ret.best_json = JSON.stringify(data.best);
        ret.outside_best_json = JSON.stringify(data.outside_best);
        ret.recent_json = JSON.stringify(data.recent);
        return ret;
        /* eslint-enable */
    }

    public test(): void {
        /* eslint-disable @typescript-eslint/camelcase */
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
        /* eslint-enable */

        const version = this.configuration.defaultVersionName;
        const config = this.configuration.versions[version];

        const spreadsheet = SpreadsheetApp.openById(config.ratingDataForAnalysisSpreadsheetId);
        const worksheet = spreadsheet.getSheetByName(config.ratingDataForAnalysisWorksheetName);

        const rows = data.map(d => this.toRow(d));
        const schema = new GenericDatabaseTableSchema(PlayerRecordRepositoryRow, ["id"]);
        const table = new SpreadsheetDatabaseTable(schema, worksheet);
        table.update(rows);
    }
}
