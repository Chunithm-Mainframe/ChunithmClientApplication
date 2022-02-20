import { Difficulty } from "../../Layer1/Difficulty";
import { Music } from "../../Layer2/Music/Music";
import { MusicTable } from "../../Layer2/Music/MusicTable";
import { ReportFormModule } from "./@ReportFormModule";
import { VersionModule } from "./VersionModule";

export class MusicModule extends ReportFormModule {
    private get versionModule(): VersionModule { return this.getModule(VersionModule); }

    private readonly _tableMap: Record<string, MusicTable> = {};

    public getMusicTable(versionName: string): MusicTable {
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

    public updateMusicTable(table: MusicTable, musics: Required<Music>[]) {
        const added: Music[] = [];
        const updated: Music[] = [];
        for (const music of musics) {
            const target = table.find({ id: music.id });
            if (!target) {
                added.push(Music.instantiate(music).apply('enabled', true));
                continue;
            }

            const tmp = Music.instantiate(target);
            let isUpdated = false;
            if (!target.basicVerified && target.basicBaseRating !== music.basicBaseRating) {
                tmp.basicBaseRating = music.basicBaseRating;
                tmp.basicVerified = music.basicVerified;
                isUpdated = true;
            }
            if (!target.advancedVerified && target.advancedBaseRating !== music.advancedBaseRating) {
                tmp.advancedBaseRating = music.advancedBaseRating;
                tmp.advancedVerified = music.advancedVerified;
                isUpdated = true;
            }
            if (!target.expertVerified && target.expertBaseRating !== music.expertBaseRating) {
                tmp.expertBaseRating = music.expertBaseRating;
                tmp.expertVerified = music.expertVerified;
                isUpdated = true;
            }
            if (!target.masterVerified && target.masterBaseRating !== music.masterBaseRating) {
                tmp.masterBaseRating = music.masterBaseRating;
                tmp.masterVerified = music.masterVerified;
                isUpdated = true;
            }
            if (!target.ultimaVerified && target.ultimaBaseRating !== music.ultimaBaseRating) {
                tmp.ultimaBaseRating = music.ultimaBaseRating;
                tmp.ultimaVerified = music.ultimaVerified;
                isUpdated = true;
            }

            if (isUpdated) {
                updated.push(Music.instantiate(tmp));
            }
        }

        const deleted = table.records
            .filter(x => x.enabled && !musics.find(y => y.id === x.id))
            .map(x => Music.instantiate(x).apply('enabled', false));

        table.update(added.concat(updated, deleted));

        return {
            added: added,
            updated: updated,
            deleted: deleted,
        };
    }

    public updateMusics(table: MusicTable, musics: Required<Music>[]) {
        const updatedMusics: Music[] = [];
        const updatedMusicDetails: { id: number; difficulty: Difficulty; baseRating: number }[] = [];
        const difficulties = [Difficulty.Basic, Difficulty.Advanced, Difficulty.Expert, Difficulty.Master];

        for (const music of musics) {
            const current = table.find({ id: music.id });
            if (!current) {
                continue;
            }

            const next = Music.instantiate(current);
            let isUpdate = false;

            for (const difficulty of difficulties) {
                if (!Music.getVerified(current, difficulty) && Music.getVerified(music, difficulty)) {
                    const baseRating = Music.getBaseRating(music, difficulty);
                    Music.setBaseRating(next, difficulty, baseRating);
                    Music.setVerified(next, difficulty, true);
                    updatedMusicDetails.push({
                        id: next.id,
                        difficulty: difficulty,
                        baseRating: baseRating
                    });
                    isUpdate = true;
                }
            }

            if (isUpdate) {
                updatedMusics.push(next);
            }
        }

        table.update(updatedMusics);

        return updatedMusicDetails;
    }
}
