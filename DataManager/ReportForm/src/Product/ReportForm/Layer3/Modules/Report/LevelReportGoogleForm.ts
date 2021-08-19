import { LogLevel } from "../../../../../Packages/CustomLogger/CustomLogger";
import { CustomLogManager } from "../../../../../Packages/CustomLogger/CustomLogManager";
import { Environment } from "../../../Layer1/Environment";
import { ReportFormModule } from "../@ReportFormModule";
import { VersionModule } from "../VersionModule";
import { ReportModule } from "./ReportModule";
export class LevelReportGoogleForm {
    public constructor(private readonly _module: ReportFormModule) {
    }

    private _form: GoogleAppsScript.Forms.Form;
    public get form(): GoogleAppsScript.Forms.Form {
        if (!this._form) {
            const formId = this._module.configuration.global.bulkReportFormId;
            if (!formId) {
                CustomLogManager.log(LogLevel.Error, `bulkReportFormId is not set.`);
                return null;
            }
            const form = FormApp.openById(formId);
            if (!form) {
                throw new Error(`Form is invalid. formId: ${formId}`);
            }
            this._form = form;
        }
        return this._form;
    }

    public buildForm(versionName: string): void {
        CustomLogManager.log(LogLevel.Info, `一括報告フォームを構築します: ${versionName}`);
        CustomLogManager.log(LogLevel.Info, 'フォームに送信された回答の削除...');
        const form = this._module.getModule(ReportModule).levelReportGoogleForm;
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
            form.setTitle(`譜面定数 一括検証報告 ${versionConfig.displayVersionName}`);
        }
        else {
            form.setTitle(`譜面定数 一括検証報告 ${versionConfig.displayVersionName} [Dev]`);
        }
        CustomLogManager.log(LogLevel.Info, 'パラメータ記入画面の作成...');
        {
            const levelSelector = form.addListItem();
            levelSelector.setTitle('レベルを選択してください');
            levelSelector.setRequired(true);
            const choices: GoogleAppsScript.Forms.Choice[] = [];
            for (let i = 1; i <= 6; i++) {
                const choice = levelSelector.createChoice(i.toString());
                choices.push(choice);
            }
            levelSelector.setChoices(choices);
        }
        {
            const opInput = form.addTextItem();
            opInput.setTitle("OPを入力してください");
            opInput.setRequired(true);
            opInput.setValidation(FormApp.createTextValidation()
                .requireNumberGreaterThan(0)
                .build());
        }
        {
            const opRatioInput = form.addTextItem();
            opRatioInput.setTitle("OP割合を入力してください");
            opRatioInput.setRequired(true);
            opRatioInput.setValidation(FormApp.createTextValidation()
                .requireNumberBetween(0, 100)
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
