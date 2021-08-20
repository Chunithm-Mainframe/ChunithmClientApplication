import { RoutingNode } from "../../../../../Packages/Router/RoutingNode";
import { Difficulty } from "../../../Layer1/Difficulty";
import { MusicModule } from "../../../Layer3/Modules/MusicModule";
import { VersionModule } from "../../../Layer3/Modules/VersionModule";
import { Music } from "../../../Layer2/Music/Music";
import { Utility } from "../../../Layer2/Utility";
import { ReportFormWebsiteController, ReportFormWebsiteParameter } from "../@ReportFormController";
import { TopWebsiteController } from "../TopWebsiteController";
import { DIProperty } from "../../../../../Packages/DIProperty/DIProperty";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UnverifiedListByGenreWebsiteParameter extends ReportFormWebsiteParameter {
}

class UnverifiedListByGenreListItemMusicData {
    public name: string;
    public difficulty: Difficulty;
    public genre: string;
    public level: number;

    public setByMusicData(music: Music, difficulty: Difficulty): void {
        this.name = music.name;
        this.difficulty = difficulty;
        this.genre = music.genre;
        this.level = Music.getBaseRating(music, difficulty);
    }
}

export class UnverifiedListByGenreWebsiteController extends ReportFormWebsiteController<UnverifiedListByGenreWebsiteParameter> {
    private readonly difficulties = [
        Difficulty.Basic, Difficulty.Advanced, Difficulty.Expert, Difficulty.Master,
    ];

    private get versionModule(): VersionModule { return this.getModule(VersionModule); }
    private get musicModule(): MusicModule { return this.getModule(MusicModule); }

    @DIProperty.inject("DoGet")
    private readonly doGetParameter: GoogleAppsScript.Events.DoGet;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected callInternal(parameter: UnverifiedListByGenreWebsiteParameter, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        let source = this.readHtml("Resources/Page/unverified_list_genre/main");

        source = this.replacePageLink(source, parameter, TopWebsiteController);
        source = this.replacePageLink(source, parameter, UnverifiedListByGenreWebsiteController);

        const genres = this.versionModule.getVersionConfig(this.targetGameVersion).genres;
        source = source.replace(/%difficulty_select_list%/g, this.getDifficultySelectListHtml(this.doGetParameter.parameter));
        source = source.replace(/%genre_select_list%/g, this.getGenreSelectListHtml(this.doGetParameter.parameter, genres));
        source = source.replace(/%list%/g, this.getListHtml(this.targetGameVersion, this.doGetParameter.parameter, genres))

        return this.createHtmlOutput(source);
    }

    private getDifficultySelectListHtml(parameter: object): string {
        let listHtml = "";
        for (const difficulty of this.difficulties) {
            listHtml += this.getDifficultySelectListItemHtml(parameter, difficulty) + "\n";
        }
        return listHtml;
    }

    private getDifficultySelectListItemHtml(parameter: object, difficulty: Difficulty): string {
        const checked = this.enabledDifficulty(parameter, difficulty) ? "checked" : "";
        return `<div><input type="checkbox" name="diff_${difficulty}" value="1" ${checked}>${Utility.toDifficultyText(difficulty)}</div>`;
    }

    private getGenreSelectListHtml(parameter: object, genres: string[]): string {
        let listHtml = "";
        for (const genre of genres) {
            listHtml += this.getGenreSelectListItemHtml(parameter, genre) + "\n";
        }
        return listHtml;
    }

    private getGenreSelectListItemHtml(parameter: object, genre: string): string {
        const checked = this.enabledGenre(parameter, genre) ? "checked" : "";
        return `<div><div><input type="checkbox" name="genre_${genre}" value="1" ${checked}>${genre}</div></div>`;
    }

    private getListHtml(version: string, parameter: object, genres: string[]): string {
        let enabledDifficulty = false;
        for (const diff of this.difficulties) {
            if (this.enabledDifficulty(parameter, diff)) {
                enabledDifficulty = true;
                break;
            }
        }
        if (!enabledDifficulty) {
            return "";
        }

        let enabledGenre = false;
        for (const genre of genres) {
            if (this.enabledGenre(parameter, genre)) {
                enabledGenre = true;
                break;
            }
        }
        if (!enabledGenre) {
            return "";
        }

        const unverifiedMusicDatas = this.getUnverifiedMusicDatas(version);
        const genreListHtmls = genres.map(g => this.getGenreListHtml(parameter, unverifiedMusicDatas, g));
        let listHtml = "";
        for (const html of genreListHtmls) {
            listHtml += html + "\n";
        }
        return listHtml;
    }

    private getUnverifiedMusicDatas(version: string): UnverifiedListByGenreListItemMusicData[] {
        const musics = this.musicModule.getMusicTable(version).records;
        const unverifiedMusicDatas: UnverifiedListByGenreListItemMusicData[] = [];
        for (const music of musics) {
            for (const difficulty of this.difficulties) {
                if (!Music.getVerified(music, difficulty)) {
                    const md = new UnverifiedListByGenreListItemMusicData();
                    md.setByMusicData(music, difficulty);
                    unverifiedMusicDatas.push(md);
                }
            }
        }
        return unverifiedMusicDatas;
    }

    private getGenreListHtml(parameter: object, musicDatas: UnverifiedListByGenreListItemMusicData[], genre: string): string {
        if (!this.enabledGenre(parameter, genre)) {
            return "";
        }
        let filteredMusicDatas = this.filterByGenre(parameter, musicDatas, genre);
        filteredMusicDatas = this.filterByDifficulty(parameter, filteredMusicDatas);
        let html = "";
        for (const musicData of filteredMusicDatas) {
            html += this.getListItemHtml(musicData);
        }

        return `
<div class='box_2'>
    <div class='box_2_title'>${genre}</div>
    ${html}
</div>`;
    }

    private filterByGenre(parameter: object, musicDatas: UnverifiedListByGenreListItemMusicData[], genre: string): UnverifiedListByGenreListItemMusicData[] {
        if (!musicDatas || musicDatas.length === 0) {
            return [];
        }
        if (!this.enabledGenre(parameter, genre)) {
            return [];
        }
        return musicDatas.filter(d => d.genre === genre);
    }

    private filterByDifficulty(parameter: object, musicDatas: UnverifiedListByGenreListItemMusicData[]): UnverifiedListByGenreListItemMusicData[] {
        if (!musicDatas || musicDatas.length === 0) {
            return [];
        }
        return musicDatas.filter(d => this.enabledDifficulty(parameter, d.difficulty));
    }

    private getListItemHtml(musicData: UnverifiedListByGenreListItemMusicData): string {
        return `<div class='music_list bg_${Utility.toDifficultyTextLowerCase(musicData.difficulty)}'>${musicData.name}</div>\n`;
    }

    private enabledDifficulty(parameter: object, difficulty: Difficulty): boolean {
        return parameter[`diff_${difficulty}`] ? true : false;
    }

    private enabledGenre(parameter: object, genre: string): boolean {
        return parameter[`genre_${genre}`] ? true : false;
    }
}
