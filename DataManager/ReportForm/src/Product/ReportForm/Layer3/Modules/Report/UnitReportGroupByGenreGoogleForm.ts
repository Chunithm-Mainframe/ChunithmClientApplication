import { LogLevel } from "../../../../../Packages/CustomLogger/CustomLogger";
import { CustomLogManager } from "../../../../../Packages/CustomLogger/CustomLogManager";
import { Environment } from "../../../Layer1/Environment";
import { MusicTable } from "../../../Layer2/Music/MusicTable";
import { ReportFormModule } from "../@ReportFormModule";
import { MusicModule } from "../MusicModule";
import { VersionModule } from "../VersionModule";
import { ReportGoogleForm } from "./@ReportGoogleForm";

export class UnitReportGroupByGenreGoogleForm extends ReportGoogleForm {
    public constructor(module: ReportFormModule) {
        super(module, () => module.configuration.global.unitReportGroupByGenreFormId);
    }

    public buildForm(versionName: string): void {
        CustomLogManager.log(LogLevel.Info, `単曲検証報告(ジャンル)フォームを構築します: ${versionName}`);
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
            form.setTitle(`譜面定数 単曲検証報告 (ジャンル別) - ${this._module.configuration.versions[versionName].displayVersionName}`);
        }
        else {
            form.setTitle(`[Dev]譜面定数 単曲検証報告 (ジャンル別) - ${this._module.configuration.versions[versionName].displayVersionName}`);
        }
        const genreSelect = form.addListItem();
        genreSelect.setTitle('ジャンルを選択してください');
        genreSelect.setRequired(true);
        CustomLogManager.log(LogLevel.Info, `楽曲選択画面の作成...`);
        const table = this._module.getModule(MusicModule).getMusicTable(versionName);
        const genres = this._module.getModule(VersionModule).getVersionConfig(versionName).genres;
        const musicSelectPages: Record<string, GoogleAppsScript.Forms.PageBreakItem> = {};
        for (const genre of genres) {
            musicSelectPages[genre] = this.buildFormMusicSelectPage(form, table, genre);
            Utilities.sleep(500);
        }
        CustomLogManager.log(LogLevel.Info, `楽曲選択画面の作成が完了しました`);
        CustomLogManager.log(LogLevel.Info, `ジャンル選択画面の構築...`);
        this.buildGenreSelect(genreSelect, genres, musicSelectPages);
        CustomLogManager.log(LogLevel.Info, `ジャンル選択画面の構築中が完了しました`);
        Utilities.sleep(1000);
        CustomLogManager.log(LogLevel.Info, `パラメータ記入画面の作成...`);
        const scoreInputPage = this.buildInputPage(form);
        CustomLogManager.log(LogLevel.Info, `パラメータ記入画面の作成が完了しました`);
        Utilities.sleep(1000);
        CustomLogManager.log(LogLevel.Info, `ページ遷移の構築...`);
        for (const genre of genres) {
            musicSelectPages[genre].setGoToPage(scoreInputPage);
        }
        CustomLogManager.log(LogLevel.Info, `ページ遷移の構築が完了しました`);
        CustomLogManager.log(LogLevel.Info, `報告フォームの構築が完了しました`);
    }
    private buildFormMusicSelectPage(form: GoogleAppsScript.Forms.Form, table: MusicTable, targetGenre: string): GoogleAppsScript.Forms.PageBreakItem {
        const page = form.addPageBreakItem();
        page.setTitle('楽曲選択');
        const musicList = form.addListItem();
        musicList.setTitle(`楽曲を選択してください(${targetGenre})`);
        musicList.setRequired(true);
        const musics = table.records.filter(m => m.genre === targetGenre)
        if (musics.length > 0) {
            musicList.setChoiceValues(musics.map(m => m.name));
        }
        return page;
    }
    private buildGenreSelect(
        genreSelect: GoogleAppsScript.Forms.ListItem,
        genres: string[],
        musicSelectPages: Record<string, GoogleAppsScript.Forms.PageBreakItem>): void {
        const choices: GoogleAppsScript.Forms.Choice[] = [];
        for (const genre of genres) {
            const page = musicSelectPages[genre];
            const choice = genreSelect.createChoice(genre, page);
            choices.push(choice);
        }
        genreSelect.setChoices(choices);
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
