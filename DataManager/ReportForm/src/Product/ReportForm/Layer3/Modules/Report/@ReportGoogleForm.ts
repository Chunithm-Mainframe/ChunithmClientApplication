import { LogLevel } from "../../../../../Packages/CustomLogger/CustomLogger";
import { CustomLogManager } from "../../../../../Packages/CustomLogger/CustomLogManager";
import { ReportFormModule } from "../@ReportFormModule";

export abstract class ReportGoogleForm {
    public constructor(
        protected readonly _module: ReportFormModule,
        protected readonly _formIdGetter: () => string) { }

    private _form: GoogleAppsScript.Forms.Form;
    public get form(): GoogleAppsScript.Forms.Form {
        if (this._form) {
            return this._form;
        }

        const formId = this._formIdGetter?.();
        if (!formId) {
            CustomLogManager.log(LogLevel.Error, `[${this.constructor.name}]formId is not set.`);
            return null;
        }

        this._form = FormApp.openById(formId);
        if (!this._form) {
            CustomLogManager.log(LogLevel.Error, `[${this.constructor.name}]Form is invalid. formId: ${formId}`);
            return null;
        }
        return this._form;
    }

    public abstract buildForm(versionName: string): void;
}
