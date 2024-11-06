class VersionModule extends ReportFormModule {
    public static readonly moduleName = 'version';

    public getVersionConfig(versionName: string): ReportForm.VersionConfigurationSchema {
        return this.configuration.versions[versionName];
    }

    public getDefaultVersionConfig(): ReportForm.VersionConfigurationSchema {
        const versionName = this.configuration.global.defaultVersionName;
        return this.getVersionConfig(versionName);
    }

    public getLatestVersionConfig(): ReportForm.VersionConfigurationSchema {
        const versionName = this.configuration.latestVersionName;
        return this.getVersionConfig(versionName);
    }
}
