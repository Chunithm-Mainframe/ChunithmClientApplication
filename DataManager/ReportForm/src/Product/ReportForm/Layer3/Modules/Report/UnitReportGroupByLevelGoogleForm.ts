import { LogLevel } from "../../../../../Packages/CustomLogger/CustomLogger";
import { CustomLogManager } from "../../../../../Packages/CustomLogger/CustomLogManager";
import { Environment } from "../../../Layer1/Environment";
import { Music } from "../../../Layer2/Music/Music";
import { MusicTable } from "../../../Layer2/Music/MusicTable";
import { ReportFormModule } from "../@ReportFormModule";
import { MusicModule } from "../MusicModule";
import { ReportGoogleForm } from "./@ReportGoogleForm";

export class UnitReportGroupByLevelGoogleForm extends ReportGoogleForm {
    public static getLevelInfos() {
        return [15.0, 14.5, 14.0, 13.5, 13.0]
            .map(x => {
                return {
                    value: x,
                    text: ((x * 10) % 10 >= 5) ? `${Math.floor(x)}+` : `${x}`,
                };
            });
    }

    public constructor(module: ReportFormModule) {
        super(module, () => module.configuration.global.unitReportGroupByLevelFormId);
    }

    public buildForm(versionName: string): void {
        CustomLogManager.log(LogLevel.Info, `単曲検証報告(レベル)報告フォームを構築します: ${versionName}`);
        CustomLogManager.log(LogLevel.Info, 'フォームに送信された回答の削除...');
        const form = this.form;
        form.deleteAllResponses();
        {
            for (const item of form.getItems()) {
                form.deleteItem(item);
                Utilities.sleep(100);
            }
        }
        CustomLogManager.log(LogLevel.Info, `フォームに送信された回答の削除が完了しました`);
        if (this._module.configuration.environment === Environment.Release) {
            form.setTitle(`譜面定数 単曲検証報告 (レベル別) - ${this._module.configuration.versions[versionName].displayVersionName}`);
        }
        else {
            form.setTitle(`[Dev]譜面定数 単曲検証報告 (レベル別) - ${this._module.configuration.versions[versionName].displayVersionName}`);
        }
        const levelSelect = form.addListItem();
        levelSelect.setTitle('レベルを選択してください');
        levelSelect.setRequired(true);
        CustomLogManager.log(LogLevel.Info, `楽曲選択画面の作成...`);
        const table = this._module.getModule(MusicModule).getMusicTable(versionName);

        const levelInfos = UnitReportGroupByLevelGoogleForm.getLevelInfos();
        const musicSelectPages: Record<string, GoogleAppsScript.Forms.PageBreakItem> = {};
        for (const levelInfo of levelInfos) {
            musicSelectPages[levelInfo.text] = this.buildFormMusicSelectPage(form, table, levelInfo.value, levelInfo.text);
        }

        CustomLogManager.log(LogLevel.Info, `楽曲選択画面の作成が完了しました`);
        CustomLogManager.log(LogLevel.Info, `レベル選択画面の構築...`);
        this.buildLevelSelect(levelSelect, levelInfos.map(x => x.text), musicSelectPages);
        CustomLogManager.log(LogLevel.Info, `レベル選択画面の構築中が完了しました`);
        Utilities.sleep(1000);
        CustomLogManager.log(LogLevel.Info, `パラメータ記入画面の作成...`);
        const scoreInputPage = this.buildInputPage(form);
        CustomLogManager.log(LogLevel.Info, `パラメータ記入画面の作成が完了しました`);
        Utilities.sleep(1000);
        CustomLogManager.log(LogLevel.Info, `ページ遷移の構築...`);
        for (const levelInfo of levelInfos) {
            musicSelectPages[levelInfo.text].setGoToPage(scoreInputPage);
        }
        CustomLogManager.log(LogLevel.Info, `ページ遷移の構築が完了しました`);
        CustomLogManager.log(LogLevel.Info, `報告フォームの構築が完了しました`);
    }
    private buildFormMusicSelectPage(
        form: GoogleAppsScript.Forms.Form,
        table: MusicTable,
        targetLevel: number,
        targetLevelText: string): GoogleAppsScript.Forms.PageBreakItem {
        const page = form.addPageBreakItem();
        page.setTitle('楽曲選択');
        const musicList = form.addListItem();
        musicList.setTitle(`楽曲を選択してください(Lv.${targetLevelText})`);
        musicList.setRequired(true);
        const musics = UnitReportGroupByLevelGoogleForm.getFilteredMusics(table.records, targetLevel);
        if (musics.length > 0) {
            musicList.setChoiceValues(musics.map(m => m.name));
        }
        return page;
    }

    public static getFilteredMusics(musics: Music[], targetLevel: number): Music[] {
        const filteredMusics: Music[] = [];
        for (const music of musics) {
            if (this.isTargetLevel(music.masterBaseRating, targetLevel)
                || this.isTargetLevel(music.expertBaseRating, targetLevel)
                || this.isTargetLevel(music.advancedBaseRating, targetLevel)
                || this.isTargetLevel(music.basicBaseRating, targetLevel)) {
                filteredMusics.push(music);
            }
        }
        return filteredMusics;
    }

    private static isTargetLevel(baseRating: number, targetLevel): boolean {
        return baseRating >= targetLevel && baseRating < Math.floor(targetLevel) + 1;
    }

    private buildLevelSelect(
        levelSelect: GoogleAppsScript.Forms.ListItem,
        levelTexts: string[],
        musicSelectPages: Record<string, GoogleAppsScript.Forms.PageBreakItem>): void {
        const choices: GoogleAppsScript.Forms.Choice[] = [];
        for (const levelText of levelTexts) {
            const page = musicSelectPages[levelText];
            const choice = levelSelect.createChoice(levelText, page);
            choices.push(choice);
        }
        levelSelect.setChoices(choices);
    }
    private buildInputPage(form: GoogleAppsScript.Forms.Form): GoogleAppsScript.Forms.PageBreakItem {
        const scoreInputPage = form.addPageBreakItem();
        scoreInputPage.setTitle('スコア入力');
        const difficultyList = form.addMultipleChoiceItem();
        difficultyList.setTitle("難易度を選択してください");
        difficultyList.setRequired(true);
        difficultyList.setChoiceValues(["MASTER", "EXPERT", "ADVANCED", "BASIC"]);
        const beforeOpInput = form.addTextItem();
        beforeOpInput.setTitle("変動前のOPを入力してください");
        beforeOpInput.setRequired(true);
        beforeOpInput.setValidation(FormApp.createTextValidation()
            .requireNumberGreaterThanOrEqualTo(0)
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            .build());
        const afterOpInput = form.addTextItem();
        afterOpInput.setTitle("変動後のOPを入力してください");
        afterOpInput.setRequired(true);
        afterOpInput.setValidation(FormApp.createTextValidation()
            .requireNumberGreaterThanOrEqualTo(0)
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            .build());
        const scoreInput = form.addTextItem();
        scoreInput.setTitle("スコアを入力してください");
        scoreInput.setRequired(true);
        scoreInput.setValidation(FormApp.createTextValidation()
            .requireNumberBetween(950000, 1010000)
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            .setHelpText("許容スコア範囲は[950000,1010000]です")
            .build());
        const comboStatusInput = form.addMultipleChoiceItem();
        comboStatusInput.setTitle("コンボステータスを入力してください");
        comboStatusInput.setRequired(true);
        comboStatusInput.setChoiceValues(["AJ", "FC", "なし"]);
        // OP変動確認用の画像を添付してください
        // 特定のファイル形式のみ許可
        //  - 画像
        // ファイルの最大数 5
        // 最大ファイルサイズ 10MB
        return scoreInputPage;
    }
}
