import { ReportFormModule } from "./@ReportFormModule";

export interface WebhookParameter {
    parameters: { key: string, value: string }[];
}

export class WebhookModule extends ReportFormModule {
    private _settingsManager: WebhookSettingsManager;
    public get settingsManager(): WebhookSettingsManager {
        return this._settingsManager;
    }
    public set settingsManager(value: WebhookSettingsManager) {
        this._settingsManager = value;
    }

    public invoke(eventName: string, parameter?: WebhookParameter): void {
        if (!this.settingsManager) {
            return;
        }
        const requests: GoogleAppsScript.URL_Fetch.URLFetchRequest[] = [];
        for (const callback of this.settingsManager.getCallbacks(eventName)) {
            requests.push(this.createRequest(callback, parameter));
        }
        UrlFetchApp.fetchAll(requests);
    }

    private createRequest(settings: WebhookSettings, parameter: WebhookParameter): GoogleAppsScript.URL_Fetch.URLFetchRequest {
        return {
            url: this.replaceUrlParameter(settings.callback, parameter),
            headers: settings.header,
        };
    }

    private replaceUrlParameter(url: string, parameter: WebhookParameter): string {
        if (parameter) {
            for (let param of parameter.parameters) {
                url = url.replace(param.key, param.value);
            }
        }
        return url;
    }
}

class WebhookSettings {
    private _callback: string;
    public get callback(): string {
        return this._callback;
    }

    private _header: { [key: string]: string };
    public get header(): { [key: string]: string } {
        return this._header
    }

    public constructor(callback: string, headerJson?: string) {
        this._callback = callback;
        this._header = headerJson ? JSON.parse(headerJson) : {};
    }
}

export class WebhookSettingsManager {
    public static readBySheet(spreadsheetId: string, worksheetName: string): WebhookSettingsManager {
        let sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(worksheetName);
        if (!sheet) {
            throw new Error(`Worksheet not found. (${worksheetName})`);
        }

        let datas = sheet.getDataRange().getValues();
        const settings: { eventName: string, settings: WebhookSettings }[] = [];
        for (let i = 1; i < datas.length; i++) {
            settings.push({
                eventName: datas[i][0],
                settings: new WebhookSettings(datas[i][1], datas[i][2]),
            });
        }
        return new WebhookSettingsManager(settings);
    }

    public constructor(settingsList: { eventName: string, settings: WebhookSettings }[]) {
        for (let settings of settingsList) {
            if (!(settings.eventName in this._callbackMap)) {
                this._callbackMap[settings.eventName] = [];
            }
            this._callbackMap[settings.eventName].push(settings.settings);
        }
    }

    private _callbackMap: { [eventName: string]: WebhookSettings[] } = {};

    public getCallbacks(eventName: string): WebhookSettings[] {
        if (!(eventName in this._callbackMap)) {
            return [];
        }
        return this._callbackMap[eventName];
    }
}
