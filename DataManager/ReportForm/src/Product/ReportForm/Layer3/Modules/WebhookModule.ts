class WebhookModule extends ReportFormModule {
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
        // eslint-disable-next-line
        const requests: GoogleAppsScript.URL_Fetch.URLFetchRequest[] = [];
        for (const callback of this.settingsManager.getCallbacks(eventName)) {
            requests.push(this.createRequest(callback, parameter));
        }
        UrlFetchApp.fetchAll(requests);
    }

    // eslint-disable-next-line
    private createRequest(settings: WebhookSettings, parameter: WebhookParameter): GoogleAppsScript.URL_Fetch.URLFetchRequest {
        return {
            url: this.replaceUrlParameter(settings.callback, parameter),
            headers: settings.header,
        };
    }

    private replaceUrlParameter(url: string, parameter: WebhookParameter): string {
        if (parameter) {
            for (const param of parameter.parameters) {
                url = url.replace(param.key, param.value);
            }
        }
        return url;
    }
}
