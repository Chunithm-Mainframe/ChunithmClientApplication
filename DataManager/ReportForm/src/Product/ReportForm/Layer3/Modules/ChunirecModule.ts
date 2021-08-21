
import { LogLevel } from "../../../../Packages/CustomLogger/CustomLogger";
import { CustomLogManager } from "../../../../Packages/CustomLogger/CustomLogManager";
import { Difficulty } from "../../Layer1/Difficulty";
import { ReportFormModule } from "./@ReportFormModule";

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

    public requestUpdateMusic(musicId: number, difficulty: Difficulty, baseRating: number): boolean {
        return this.requestUpdateMusics([{ musicId: musicId, difficulty: difficulty, baseRating: baseRating }]);
    }

    public requestUpdateMusics(params: { musicId: number; difficulty: Difficulty; baseRating: number }[]): boolean {
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
        }

        throw new Error(`Unsupported value. Diffiuclty::${difficulty}`);
    }
}
