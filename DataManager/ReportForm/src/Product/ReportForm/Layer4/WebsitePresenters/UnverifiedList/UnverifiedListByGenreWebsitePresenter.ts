import { DIProperty } from "../../../../../Packages/DIProperty/DIProperty";
import { RoutingNode } from "../../../../../Packages/Router/RoutingNode";
import { Difficulty } from "../../../Layer1/Difficulty";
import { Music } from "../../../Layer2/Music/Music";
import { Utility } from "../../../Layer2/Utility";
import { MusicModule } from "../../../Layer3/Modules/MusicModule";
import { VersionModule } from "../../../Layer3/Modules/VersionModule";
import { ReportFormWebsiteParameter, ReportFormWebsitePresenter } from "../@ReportFormPresenter";
import { TopWebsitePresenter } from "../TopWebsitePresenter";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UnverifiedListByGenreWebsiteParameter extends ReportFormWebsiteParameter {
}

class UnverifiedListByGenreListItem {
    public readonly name: string;
    public readonly difficulty: Difficulty;
    public readonly genre: string;
    public readonly level: number;
    public readonly createdAt: Date;

    public constructor(music: Music, difficulty: Difficulty) {
        this.name = music.name;
        this.difficulty = difficulty;
        this.genre = music.genre;
        this.level = Music.getBaseRating(music, difficulty);
        this.createdAt = music.createdAt;
    }
}

export class UnverifiedListByGenreWebsitePresenter extends ReportFormWebsitePresenter<UnverifiedListByGenreWebsiteParameter> {
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

        source = this.replacePageLink(source, parameter, TopWebsitePresenter);
        source = this.replacePageLink(source, parameter, UnverifiedListByGenreWebsitePresenter);

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

        const listItems = this.sortListItems(this.getListItems(version));
        const genreListHtmls = genres
            .filter(x => this.enabledGenre(parameter, x))
            .map(g => this.getGenreListHtml(parameter, listItems, g));
        let listHtml = "";
        for (const html of genreListHtmls) {
            listHtml += html + "\n";
        }
        return listHtml;
    }

    private getListItems(version: string): UnverifiedListByGenreListItem[] {
        const musics = this.musicModule.getMusicTable(version).records;
        const unverifiedMusicDatas: UnverifiedListByGenreListItem[] = [];
        for (const music of musics) {
            for (const difficulty of this.difficulties) {
                if (!Music.getVerified(music, difficulty)) {
                    const md = new UnverifiedListByGenreListItem(music, difficulty);
                    unverifiedMusicDatas.push(md);
                }
            }
        }
        return unverifiedMusicDatas;
    }

    private sortListItems(listItems: UnverifiedListByGenreListItem[]): UnverifiedListByGenreListItem[] {
        const map: Record<number, UnverifiedListByGenreListItem[]> = {};
        const createdAts: number[] = [];

        for (const listItem of listItems) {
            const key = listItem.createdAt.getTime();
            if (!(key in map)) {
                map[key] = [];
                createdAts.push(key);
            }
            map[key].push(listItem);
        }

        return createdAts.sort((x1, x2) => x2 - x1)
            .map(x => map[x])
            .flat();
    }

    private getGenreListHtml(parameter: object, allListItem: UnverifiedListByGenreListItem[], genre: string): string {
        if (!this.enabledGenre(parameter, genre)) {
            return "";
        }
        const listItems = this.filterListItems(allListItem, parameter, genre);
        let html = "";
        for (const listItem of listItems) {
            html += this.getListItemHtml(listItem);
        }

        return `
<div class='box_2'>
    <div class='box_2_title'>${genre}</div>
    ${html}
</div>`;
    }

    private filterListItems(musicDatas: UnverifiedListByGenreListItem[], parameter: object, genre: string): UnverifiedListByGenreListItem[] {
        if (!musicDatas || musicDatas.length === 0 || !this.enabledGenre(parameter, genre)) {
            return [];
        }
        return musicDatas.filter(x => x.genre === genre && this.enabledDifficulty(parameter, x.difficulty));
    }

    private getListItemHtml(listItem: UnverifiedListByGenreListItem): string {
        return `<div class='music_list bg_${Utility.toDifficultyTextLowerCase(listItem.difficulty)}'>${listItem.name}</div>\n`;
    }

    private enabledDifficulty(parameter: object, difficulty: Difficulty): boolean {
        return parameter[`diff_${difficulty}`] ? true : false;
    }

    private enabledGenre(parameter: object, genre: string): boolean {
        return parameter[`genre_${genre}`] ? true : false;
    }
}
