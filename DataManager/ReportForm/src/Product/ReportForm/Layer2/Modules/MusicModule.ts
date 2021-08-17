import { Music } from "../Music/Music";
import { MusicRepository } from "../Music/MusicRepository";
import { ReportFormModule } from "./@ReportFormModule";
import { VersionModule } from "./VersionModule";

export class MusicModule extends ReportFormModule {
    private get versionModule(): VersionModule { return this.getModule(VersionModule); }

    private readonly _repositories: Record<string, MusicRepository> = {};

    public getSpecifiedVersionRepository(versionName: string): MusicRepository {
        if (versionName in this._repositories) {
            return this._repositories[versionName];
        }

        const versionConfig = this.versionModule.getVersionConfig(versionName);
        if (!versionConfig) {
            return null;
        }

        const sheet = SpreadsheetApp
            .openById(versionConfig.musicDataTableSpreadsheetId)
            .getSheetByName(versionConfig.musicDataTableWorksheetName)
        this._repositories[versionName] = new MusicRepository(sheet);
        this._repositories[versionName].initialize();
        return this._repositories[versionName];
    }

    public updateSpecifiedVersionRepository(versionName: string, musics: Music[]) {
        const repository = this.getSpecifiedVersionRepository(versionName);
        return this.updateRepository(repository, musics);
    }

    public updateRepository(repository: MusicRepository, musics: Music[]) {
        const added = musics
            .filter(x => !repository.find({ id: x.id }))
            .map(x => Music.instantiate(x).apply('enabled', true));
        const deleted = repository.rows
            .filter(x => x.enabled && !musics.find(y => y.id === x.id))
            .map(x => Music.instantiate(x).apply('enabled', false));

        repository.update(added.concat(deleted));

        return {
            added: added,
            deleted: deleted
        };
    }
}
