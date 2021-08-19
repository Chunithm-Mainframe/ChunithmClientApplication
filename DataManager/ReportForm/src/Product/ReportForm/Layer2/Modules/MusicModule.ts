import { Music } from "../Music/Music";
import { MusicTable } from "../Music/MusicTable";
import { ReportFormModule } from "./@ReportFormModule";
import { VersionModule } from "./VersionModule";

export class MusicModule extends ReportFormModule {
    private get versionModule(): VersionModule { return this.getModule(VersionModule); }

    private readonly _tableMap: Record<string, MusicTable> = {};

    public getSpecifiedVersionTable(versionName: string): MusicTable {
        if (versionName in this._tableMap) {
            return this._tableMap[versionName];
        }

        const versionConfig = this.versionModule.getVersionConfig(versionName);
        if (!versionConfig) {
            return null;
        }

        const sheet = SpreadsheetApp
            .openById(versionConfig.musicSpreadsheetId)
            .getSheetByName(versionConfig.musicWorksheetName)
        this._tableMap[versionName] = new MusicTable(sheet);
        return this._tableMap[versionName];
    }

    public updateSpecifiedVersionTable(versionName: string, musics: Music[]) {
        const table = this.getSpecifiedVersionTable(versionName);
        return this.updateTable(table, musics);
    }

    public updateTable(table: MusicTable, musics: Music[]) {
        const added = musics
            .filter(x => !table.find({ id: x.id }))
            .map(x => Music.instantiate(x).apply('enabled', true));
        const deleted = table.records
            .filter(x => x.enabled && !musics.find(y => y.id === x.id))
            .map(x => Music.instantiate(x).apply('enabled', false));

        table.update(added.concat(deleted));

        return {
            added: added,
            deleted: deleted
        };
    }
}
