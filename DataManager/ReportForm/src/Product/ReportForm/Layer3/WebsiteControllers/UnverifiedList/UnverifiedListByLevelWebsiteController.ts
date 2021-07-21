import { RoutingNode } from "../../../../../Packages/Router/RoutingNode";
import { MusicDataModule } from "../../../Layer2/Modules/MusicDataModule";
import { Difficulty } from "../../../Layer2/MusicDataTable/Difficulty";
import { MusicData } from "../../../Layer2/MusicDataTable/MusicData";
import { Utility } from "../../../Layer2/Utility";
import { ReportFormWebsiteController, ReportFormWebsiteParameter } from "../@ReportFormController";
import { TopWebsiteController } from "../TopWebsiteController";

export interface UnverifiedListByLevelWebsiteParameter extends ReportFormWebsiteParameter {
}

interface GetParameter { }

class UnverifiedListByLevelListItemMusicData {
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

export class UnverifiedListByLevelWebsiteController extends ReportFormWebsiteController<UnverifiedListByLevelWebsiteParameter> {
    private readonly levelTexts = [
        '1', '2', '3', '4', '5', '6', '7', '7p', '8', '8p', '9', '9p', '10', '10p', '11', '11p', '12', '12p', '13', '13p', '14',
    ];
    private readonly difficulties = [
        Difficulty.Basic, Difficulty.Advanced, Difficulty.Expert, Difficulty.Master
    ];

    private get musicDataModule(): MusicDataModule { return this.getModule(MusicDataModule); }

    protected callInternal(parameter: UnverifiedListByLevelWebsiteParameter, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        let source = this.readHtml("Resources/Page/unverified_list_level/main");

        source = this.replacePageLink(source, parameter, TopWebsiteController);
        source = this.replacePageLink(source, parameter, UnverifiedListByLevelWebsiteController);

        source = source.replace(/%difficulty_select_list%/g, this.getDifficultySelectListHtml(this.doGetParameter.parameter));
        source = source.replace(/%levelList%/, this.getSelectLevelListHtml(this.doGetParameter.parameter));
        source = source.replace(/%list%/g, this.getListHtml(this.targetGameVersion, this.doGetParameter.parameter));

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

    private getSelectLevelListHtml(parameter: GetParameter): string {
        return this.levelTexts
            .map(x => this.getSelectLevelListItemHtml(x, this.enabledLevel(parameter, x)))
            .reduce((acc, src) => `${acc}\n${src}`, "");
    }

    private getSelectLevelListItemHtml(levelText: string, checked: boolean): string {
        return `<div><input type="checkbox" name="level_${levelText}" value="1" ${checked ? "checked" : ""}>Lv.${levelText.replace("p", "+")}</div>`;
    }

    private getListHtml(version: string, parameter: GetParameter): string {
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

        let enabledLevel = false;
        for (const levelText of this.levelTexts) {
            if (this.enabledLevel(parameter, levelText)) {
                enabledLevel = true;
                break;
            }
        }
        if (!enabledLevel) {
            return "";
        }

        const unverifiedMusicDatas = this.getUnverifiedMusicDatas(version);
        return this.levelTexts
            .map(x => this.getLevelListHtml(unverifiedMusicDatas, x, parameter))
            .reduce((acc, src) => `${acc}\n${src}`, "");
    }

    private getUnverifiedMusicDatas(version: string): UnverifiedListByLevelListItemMusicData[] {
        const musicDatas = this.musicDataModule.getTable(version).datas;
        const unverifiedMusicDatas: UnverifiedListByLevelListItemMusicData[] = [];
        for (const musicData of musicDatas) {
            for (const difficulty of this.difficulties) {
                if (!musicData.getVerified(difficulty)) {
                    const md = new UnverifiedListByLevelListItemMusicData();
                    md.setByMusicData(musicData, difficulty);
                    unverifiedMusicDatas.push(md);
                }
            }
        }
        return unverifiedMusicDatas;
    }

    private getLevelListHtml(musicDatas: UnverifiedListByLevelListItemMusicData[], levelText: string, parameter: GetParameter): string {
        if (!this.enabledLevel(parameter, levelText)) {
            return "";
        }
        let filteredMusicDatas = this.filterByLevel(musicDatas, levelText, parameter);
        filteredMusicDatas = this.filterByDifficulty(filteredMusicDatas, parameter);
        let html = "";
        for (const data of filteredMusicDatas) {
            html += this.getListItemHtml(data);
        }

        return `
<div class='box_2'>
    <div class='box_2_title'>Lv.${levelText.replace("p", "+")}</div>
    ${html}
</div>`
    }

    private filterByDifficulty(musicDatas: UnverifiedListByLevelListItemMusicData[], parameter: GetParameter): UnverifiedListByLevelListItemMusicData[] {
        if (!musicDatas || musicDatas.length === 0) {
            return [];
        }
        return musicDatas.filter(d => this.enabledDifficulty(parameter, d.difficulty));
    }

    private filterByLevel(musicDatas: UnverifiedListByLevelListItemMusicData[], levelText: string, parameter: GetParameter): UnverifiedListByLevelListItemMusicData[] {
        if (!musicDatas || musicDatas.length === 0) {
            return [];
        }
        if (!this.enabledLevel(parameter, levelText)) {
            return [];
        }
        levelText = levelText.replace(/p/g, ".7");
        return musicDatas.filter(d => d.level.toString() === levelText);
    }

    private getListItemHtml(musicData: UnverifiedListByLevelListItemMusicData): string {
        return `<div class='music_list bg_${Utility.toDifficultyTextLowerCase(musicData.difficulty)}'>${musicData.name}</div>\n`;
    }

    private enabledLevel(parameter: GetParameter, levelText: string): boolean {
        return parameter[`level_${levelText}`] ? true : false;
    }

    private enabledDifficulty(parameter: GetParameter, difficulty: Difficulty): boolean {
        return parameter[`diff_${difficulty}`] ? true : false;
    }
}
