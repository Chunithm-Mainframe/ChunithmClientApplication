import { RoutingNode } from "../../../../../Packages/Router/RoutingNode";
import { Utility } from "../../../Layer2/Utility";
import { MusicDataModule } from "../../../Layer2/Modules/MusicDataModule";
import { VersionModule } from "../../../Layer2/Modules/VersionModule";
import { Difficulty } from "../../../Layer2/MusicDataTable/Difficulty";
import { MusicData } from "../../../Layer2/MusicDataTable/MusicData";
import { ReportFormWebsiteController, ReportFormWebsiteParameter } from "../@ReportFormController";
import { TopWebsiteController } from "../TopWebsiteController";

export interface UnverifiedListByGenreWebsiteParameter extends ReportFormWebsiteParameter {
}

interface GetParameter { }

class UnverifiedListByGenreListItemMusicData {
    public name: string;
    public difficulty: Difficulty;
    public genre: string;
    public level: number;

    public setByMusicData(musicData: MusicData, difficulty: Difficulty): void {
        this.name = musicData.Name;
        this.difficulty = difficulty;
        this.genre = musicData.Genre;
        this.level = musicData.getLevel(difficulty);
    }
}

export class UnverifiedListByGenreWebsiteController extends ReportFormWebsiteController<UnverifiedListByGenreWebsiteParameter> {
    private readonly difficulties = [
        Difficulty.Basic, Difficulty.Advanced, Difficulty.Expert, Difficulty.Master,
    ];

    private get versionModule(): VersionModule { return this.getModule(VersionModule); }
    private get musicDataModule(): MusicDataModule { return this.getModule(MusicDataModule); }

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

    private getDifficultySelectListHtml(parameter: GetParameter): string {
        let listHtml = "";
        for (const difficulty of this.difficulties) {
            listHtml += this.getDifficultySelectListItemHtml(parameter, difficulty) + "\n";
        }
        return listHtml;
    }

    private getDifficultySelectListItemHtml(parameter: GetParameter, difficulty: Difficulty): string {
        const checked = this.enabledDifficulty(parameter, difficulty) ? "checked" : "";
        return `<div><input type="checkbox" name="diff_${difficulty}" value="1" ${checked}>${Utility.toDifficultyText(difficulty)}</div>`;
    }

    private getGenreSelectListHtml(parameter: GetParameter, genres: string[]): string {
        let listHtml = "";
        for (const genre of genres) {
            listHtml += this.getGenreSelectListItemHtml(parameter, genre) + "\n";
        }
        return listHtml;
    }

    private getGenreSelectListItemHtml(parameter: GetParameter, genre: string): string {
        const checked = this.enabledGenre(parameter, genre) ? "checked" : "";
        return `<div><div><input type="checkbox" name="genre_${genre}" value="1" ${checked}>${genre}</div></div>`;
    }

    private getListHtml(version: string, parameter: GetParameter, genres: string[]): string {
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
        const musicDatas = this.musicDataModule.getTable(version).datas;
        const unverifiedMusicDatas: UnverifiedListByGenreListItemMusicData[] = [];
        for (const musicData of musicDatas) {
            for (const difficulty of this.difficulties) {
                if (!musicData.getVerified(difficulty)) {
                    const md = new UnverifiedListByGenreListItemMusicData();
                    md.setByMusicData(musicData, difficulty);
                    unverifiedMusicDatas.push(md);
                }
            }
        }
        return unverifiedMusicDatas;
    }

    private getGenreListHtml(parameter: GetParameter, musicDatas: UnverifiedListByGenreListItemMusicData[], genre: string): string {
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

    private filterByGenre(parameter: GetParameter, musicDatas: UnverifiedListByGenreListItemMusicData[], genre: string): UnverifiedListByGenreListItemMusicData[] {
        if (!musicDatas || musicDatas.length === 0) {
            return [];
        }
        if (!this.enabledGenre(parameter, genre)) {
            return [];
        }
        return musicDatas.filter(d => d.genre === genre);
    }

    private filterByDifficulty(parameter: GetParameter, musicDatas: UnverifiedListByGenreListItemMusicData[]): UnverifiedListByGenreListItemMusicData[] {
        if (!musicDatas || musicDatas.length === 0) {
            return [];
        }
        return musicDatas.filter(d => this.enabledDifficulty(parameter, d.difficulty));
    }

    private getListItemHtml(musicData: UnverifiedListByGenreListItemMusicData): string {
        return `<div class='music_list bg_${Utility.toDifficultyTextLowerCase(musicData.difficulty)}'>${musicData.name}</div>\n`;
    }

    private enabledDifficulty(parameter: GetParameter, difficulty: Difficulty): boolean {
        return parameter[`diff_${difficulty}`] ? true : false;
    }

    private enabledGenre(parameter: GetParameter, genre: string): boolean {
        return parameter[`genre_${genre}`] ? true : false;
    }
}
