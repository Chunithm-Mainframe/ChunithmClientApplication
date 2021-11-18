import { LogLevel } from "../../../../../Packages/CustomLogger/CustomLogger";
import { CustomLogManager } from "../../../../../Packages/CustomLogger/CustomLogManager";
import { Environment } from "../../../Layer1/Environment";
import { ReportFormModule } from "../@ReportFormModule";
import { VersionModule } from "../VersionModule";
import { ReportGoogleForm } from "./@ReportGoogleForm";

export class LevelReportGoogleForm extends ReportGoogleForm {
    public constructor(module: ReportFormModule) {
        super(module, () => module.configuration.global.levelReportFormId);
    }

    public buildForm(versionName: string): void {
        CustomLogManager.log(LogLevel.Info, `レベル検証報告フォームを構築します: ${versionName}`);
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
        const versionConfig = this._module.getModule(VersionModule).getVersionConfig(versionName);
        if (this._module.configuration.environment === Environment.Release) {
            form.setTitle(`レベル検証報告 ${versionConfig.displayVersionName}`);
        }
        else {
            form.setTitle(`[Dev]レベル検証報告 ${versionConfig.displayVersionName}`);
        }
        CustomLogManager.log(LogLevel.Info, 'パラメータ記入画面の作成...');
        {
            const levelSelector = form.addListItem();
            levelSelector.setTitle('レベルを選択してください');
            levelSelector.setRequired(true);
            const choices: GoogleAppsScript.Forms.Choice[] = [];
            const levels = ["1", "2", "3", "4", "5", "6", "7", "7+", "8", "8+", "9", "9+"];
            for (const level of levels) {
                choices.push(levelSelector.createChoice(level));
            }

            levelSelector.setChoices(choices);
        }
        {
            const opInput = form.addTextItem();
            opInput.setTitle("OPを入力してください");
            opInput.setRequired(true);
            opInput.setValidation(FormApp.createTextValidation()
                .requireNumberGreaterThan(0)
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                .build());
        }
        {
            const opRatioInput = form.addTextItem();
            opRatioInput.setTitle("OP割合を入力してください");
            opRatioInput.setRequired(true);
            opRatioInput.setValidation(FormApp.createTextValidation()
                .requireNumberBetween(0, 100)
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                .build());
        }
        CustomLogManager.log(LogLevel.Info, `パラメータ記入画面の作成が完了しました`);
        // 検証画像を添付してください
        // 特定のファイル形式のみ許可
        //  - 画像
        // ファイルの最大数 1
        // 最大ファイルサイズ 10MB
        CustomLogManager.log(LogLevel.Info, `一括報告フォームの構築が完了しました`);
    }
}
