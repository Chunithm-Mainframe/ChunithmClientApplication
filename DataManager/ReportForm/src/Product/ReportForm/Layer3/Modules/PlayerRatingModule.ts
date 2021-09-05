import { PlayerRatingTable } from "../../Layer2/PlayerRating/PlayerRatingTable";
import { ReportFormModule } from "./@ReportFormModule";
import { VersionModule } from "./VersionModule";

export class PlayerRatingModule extends ReportFormModule {
    private get versionModule() { return this.getModule(VersionModule); }

    private readonly _tableMap: Record<string, PlayerRatingTable> = {};

    public getPlayerRatingTable(versionName: string): PlayerRatingTable {
        if (versionName in this._tableMap) {
            return this._tableMap[versionName];
        }

        const versionConfig = this.versionModule.getVersionConfig(versionName);
        if (!versionName) {
            return null;
        }

        const sheet = SpreadsheetApp
            .openById(versionConfig.playerRatingSpreadsheetId)
            .getSheetByName(versionConfig.playerRatingWorksheetName);
        this._tableMap[versionName] = new PlayerRatingTable(sheet);
        return this._tableMap[versionName];
    }
}
