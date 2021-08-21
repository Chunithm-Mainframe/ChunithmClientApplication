import { DIProperty } from "../../../../../Packages/DIProperty/DIProperty";
import { RoutingNode } from "../../../../../Packages/Router/RoutingNode";
import { Difficulty } from "../../../Layer1/Difficulty";
import { MusicModule } from "../../../Layer3/Modules/MusicModule";
import { Music } from "../../../Layer2/Music/Music";
import { Utility } from "../../../Layer2/Utility";
import { ReportFormWebsitePresenter, ReportFormWebsiteParameter } from "../@ReportFormPresenter";
import { TopWebsitePresenter } from "../TopWebsitePresenter";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UnverifiedListByLevelWebsiteParameter extends ReportFormWebsiteParameter {
}

class UnverifiedListByLevelListItem {
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

export class UnverifiedListByLevelWebsitePresenter extends ReportFormWebsitePresenter<UnverifiedListByLevelWebsiteParameter> {
    private readonly levelTexts = [
        '1', '2', '3', '4', '5', '6', '7', '7p', '8', '8p', '9', '9p', '10', '10p', '11', '11p', '12', '12p', '13', '13p', '14',
    ];
    private readonly difficulties = [
        Difficulty.Basic, Difficulty.Advanced, Difficulty.Expert, Difficulty.Master
    ];

    private get musicModule(): MusicModule { return this.getModule(MusicModule); }

    @DIProperty.inject("DoGet")
    private readonly doGetParameter: GoogleAppsScript.Events.DoGet;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected callInternal(parameter: UnverifiedListByLevelWebsiteParameter, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        let source = this.readHtml("Resources/Page/unverified_list_level/main");

        source = this.replacePageLink(source, parameter, TopWebsitePresenter);
        source = this.replacePageLink(source, parameter, UnverifiedListByLevelWebsitePresenter);

        source = source.replace(/%difficulty_select_list%/g, this.getDifficultySelectListHtml(this.doGetParameter.parameter));
        source = source.replace(/%levelList%/, this.getSelectLevelListHtml(this.doGetParameter.parameter));
        source = source.replace(/%list%/g, this.getListHtml(this.targetGameVersion, this.doGetParameter.parameter));

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

    private getSelectLevelListHtml(parameter: object): string {
        return this.levelTexts
            .map(x => this.getSelectLevelListItemHtml(x, this.enabledLevel(parameter, x)))
            .reduce((acc, src) => `${acc}\n${src}`, "");
    }

    private getSelectLevelListItemHtml(levelText: string, checked: boolean): string {
        return `<div><input type="checkbox" name="level_${levelText}" value="1" ${checked ? "checked" : ""}>Lv.${levelText.replace("p", "+")}</div>`;
    }

    private getListHtml(version: string, parameter: object): string {
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

        const listItems = this.sortListItems(this.getListItems(version));
        return this.levelTexts
            .map(x => this.getLevelListHtml(listItems, parameter, x))
            .reduce((acc, src) => `${acc}\n${src}`, "");
    }

    private getListItems(version: string): UnverifiedListByLevelListItem[] {
        const musics = this.musicModule.getMusicTable(version).records;
        const listItems: UnverifiedListByLevelListItem[] = [];
        for (const music of musics) {
            for (const difficulty of this.difficulties) {
                if (!Music.getVerified(music, difficulty)) {
                    const md = new UnverifiedListByLevelListItem(music, difficulty);
                    listItems.push(md);
                }
            }
        }
        return listItems;
    }

    private sortListItems(listItems: UnverifiedListByLevelListItem[]): UnverifiedListByLevelListItem[] {
        const map: Record<number, UnverifiedListByLevelListItem[]> = {};
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

    private getLevelListHtml(allListItem: UnverifiedListByLevelListItem[], parameter: object, levelText: string): string {
        if (!this.enabledLevel(parameter, levelText)) {
            return "";
        }

        let html = "";
        for (const listItem of this.filterListItems(allListItem, parameter, levelText)) {
            html += this.getListItemHtml(listItem);
        }

        return `
<div class='box_2'>
    <div class='box_2_title'>Lv.${levelText.replace("p", "+")}</div>
    ${html}
</div>`
    }

    private filterListItems(listItems: UnverifiedListByLevelListItem[], parameter: object, levelText: string): UnverifiedListByLevelListItem[] {
        if (!listItems || listItems.length === 0 || !this.enabledLevel(parameter, levelText)) {
            return [];
        }
        levelText = levelText.replace(/p/g, ".7");
        return listItems.filter(x => this.enabledDifficulty(parameter, x.difficulty) && x.level.toString() === levelText);
    }

    private getListItemHtml(listItem: UnverifiedListByLevelListItem): string {
        return `<div class='music_list bg_${Utility.toDifficultyTextLowerCase(listItem.difficulty)}'>${listItem.name}</div>\n`;
    }

    private enabledLevel(parameter: object, levelText: string): boolean {
        return parameter[`level_${levelText}`] ? true : false;
    }

    private enabledDifficulty(parameter: object, difficulty: Difficulty): boolean {
        return parameter[`diff_${difficulty}`] ? true : false;
    }
}
