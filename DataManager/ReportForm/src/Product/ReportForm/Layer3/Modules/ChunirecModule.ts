
import { LogLevel } from "../../../../Packages/CustomLogger/CustomLogger";
import { CustomLogManager } from "../../../../Packages/CustomLogger/CustomLogManager";
import { Difficulty } from "../../Layer1/Difficulty";
import { MusicRating } from "../../Layer2/PlayerRating/MusicRating";
import { PlayerRating } from "../../Layer2/PlayerRating/PlayerRating";
import { ReportFormModule } from "./@ReportFormModule";

interface RatingDataRecord {
    sort_num: number;
    music_idx: number;
    music_diff: string;
    score: number;
}

interface RatingData {
    id: string;
    best: RatingDataRecord[];
    outside_best: RatingDataRecord[];
    recent: RatingDataRecord[];
}

export class ChunirecModule extends ReportFormModule {
    private _apiHost: string = null;
    public get apiHost(): string {
        if (!this._apiHost) {
            this._apiHost = this.rootModule.configuration.global.chunirecApiHost;
        }
        return this._apiHost;
    }

    private _apiToken: string = null;
    public get apiToken(): string {
        if (!this._apiToken) {
            this._apiToken = this.rootModule.configuration.global.chunirecApiToken;
        }
        return this._apiToken;
    }

    public requestPlayerRatings(sinceId: number, count: number) {
        if (!this.configuration.runtime.postChunirecEnabled) {
            return [];
        }

        try {
            const url = `${this.apiHost}/1.2/repository/rating_data.json?token=${this.apiToken}&since_id=${sinceId}&count=${count}`;
            const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });

            if (response.getResponseCode() !== 200) {
                throw new Error(`failure ChunirecModule.requestPlayerRatings.
code: ${response.getResponseCode()}
content: ${response.getContentText()}`);
            }

            const json: RatingData[] = JSON.parse(response.getContentText());

            return json.map(x => {
                const p = new PlayerRating();
                p.id = parseInt(x.id);
                p.setBest(ChunirecModule.convertToMusicRatings(x.best));
                p.setOutsideBest(ChunirecModule.convertToMusicRatings(x.outside_best));
                p.setRecent(ChunirecModule.convertToMusicRatings(x.recent));
                return p;
            })
        }
        catch (e) {
            CustomLogManager.exception(e);
            return [];
        }
    }

    private static convertToMusicRatings(records: RatingDataRecord[]): MusicRating[] {
        return records.slice().sort((x1, x2) => x1.sort_num - x2.sort_num).map(this.convertToMusicRating);
    }

    private static convertToMusicRating(record: RatingDataRecord): MusicRating {
        return {
            id: record.music_idx,
            difficulty: this.toDifficulty(record.music_diff),
            score: record.score,
        }
    }

    public getUpdateMusicAllUrl() {
        return `${this.apiHost}/1.2/music/update_all.json`;
    }

    public getUpdateMusicAllRequestOptions(params: { musicId: number; difficulty: Difficulty; baseRating: number }[]):
        // eslint-disable-next-line
        GoogleAppsScript.URL_Fetch.URLFetchRequestOptions {
        const payload = params.map(x => {
            return {
                idx: x.musicId,
                diff: this.toDifficultyText(x.difficulty),
                const: x.baseRating,
            };
        });

        return {
            contentType: 'application/json',
            method: 'post',
            headers: {
                'X-Auth-Token': this.apiToken,
            },
            payload: JSON.stringify(payload),
            muteHttpExceptions: true,
        };
    }

    public requestUpdateMusicAll(params: { musicId: number; difficulty: Difficulty; baseRating: number }[]) {
        if (!this.configuration.runtime.postChunirecEnabled) {
            return {
                ok: params.map(x => { return { idx: x.musicId, diff: this.toDifficultyText(x.difficulty) }; }),
                failed: [] as { idx: number; diff: string }[],
                success: true,
            };
        }

        const url = this.getUpdateMusicAllUrl();
        const options = this.getUpdateMusicAllRequestOptions(params);
        try {
            const response = UrlFetchApp.fetch(url, options);
            if (response.getResponseCode() !== 200) {
                throw new Error(`failure ChunirecModule.requestUpdateMusicAll.
code: ${response.getResponseCode()}
content:
${response.getContentText()}

payload:
${JSON.stringify(options.payload)}`);
            }

            const result = JSON.parse(response.getContentText()) as {
                ok: { idx: number; diff: string }[];
                failed: { idx: number; diff: string }[];
                success: boolean;
            };
            result.success = true;
            return result;
        }
        catch (e) {
            CustomLogManager.exception(e);
            return {
                ok: [],
                failed: [],
                success: false,
            }
        }
    }

    public requestUpdateMusics(params: { musicId: number; difficulty: Difficulty; baseRating: number }[]): boolean {
        if (!this.configuration.runtime.postChunirecEnabled) {
            return true;
        }

        // eslint-disable-next-line
        const requests: GoogleAppsScript.URL_Fetch.URLFetchRequest[] = [];
        for (const param of params) {
            requests.push({
                url: `${this.apiHost}/1.2/music/update.json`,
                payload: {
                    idx: param.musicId,
                    diff: this.toDifficultyText(param.difficulty),
                    const: param.baseRating,
                    token: this.apiToken,
                },
                muteHttpExceptions: true,
            });
        }
        let success = true;
        try {
            const responses = UrlFetchApp.fetchAll(requests);
            for (const response of responses) {
                if (response.getResponseCode() !== 200) {
                    CustomLogManager.log(
                        LogLevel.Error,
                        `failure ChunirecModule.requestUpdateMusics.
${response.getContentText()}`);
                    success = false;
                }
            }
        }
        catch (e) {
            CustomLogManager.exception(e);
            success = false;
        }
        return success;
    }

    private static toDifficulty(difficultyText: string): Difficulty {
        switch (difficultyText.toUpperCase()) {
            case "BAS":
                return Difficulty.Basic;
            case "ADV":
                return Difficulty.Advanced;
            case "EXP":
                return Difficulty.Expert;
            case "MAS":
                return Difficulty.Master;
            case "ULT":
                return Difficulty.Ultima;
        }

        throw new Error(`Unsupported value. Diffiuclty-Text: ${difficultyText}`);
    }

    private toDifficultyText(difficulty: Difficulty): string {
        switch (difficulty) {
            case Difficulty.Basic:
                return 'BAS';
            case Difficulty.Advanced:
                return 'ADV';
            case Difficulty.Expert:
                return 'EXP';
            case Difficulty.Master:
                return 'MAS';
            case Difficulty.Ultima:
                return 'ULT';
        }

        throw new Error(`Unsupported value. Diffiuclty::${difficulty}`);
    }
}
