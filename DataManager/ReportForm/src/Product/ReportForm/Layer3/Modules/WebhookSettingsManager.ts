class WebhookSettingsManager {
    public static readBySheet(spreadsheetId: string, worksheetName: string): WebhookSettingsManager {
        const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(worksheetName);
        if (!sheet) {
            throw new Error(`Worksheet not found. (${worksheetName})`);
        }

        const datas = sheet.getDataRange().getValues();
        const settings: { eventName: string; settings: WebhookSettings; }[] = [];
        for (let i = 1; i < datas.length; i++) {
            settings.push({
                eventName: datas[i][0],
                settings: new WebhookSettings(datas[i][1], datas[i][2]),
            });
        }
        return new WebhookSettingsManager(settings);
    }

    public constructor(settingsList: { eventName: string; settings: WebhookSettings; }[]) {
        for (const settings of settingsList) {
            if (!(settings.eventName in this._callbackMap)) {
                this._callbackMap[settings.eventName] = [];
            }
            this._callbackMap[settings.eventName].push(settings.settings);
        }
    }

    private _callbackMap: { [eventName: string]: WebhookSettings[]; } = {};

    public getCallbacks(eventName: string): WebhookSettings[] {
        if (!(eventName in this._callbackMap)) {
            return [];
        }
        return this._callbackMap[eventName];
    }
}
