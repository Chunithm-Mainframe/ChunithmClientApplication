import { VersionConfigurationSchema } from "../../Layer1/Configurations/ConfigurationSchema";
import { ReportFormModule } from "./@ReportFormModule";

export class VersionModule extends ReportFormModule {
    public static readonly moduleName = 'version';

    public getVersionConfig(versionName: string): VersionConfigurationSchema {
        return this.configuration.versions[versionName];
    }

    public getDefaultVersionConfig(): VersionConfigurationSchema {
        const versionName = this.configuration.global.defaultVersionName;
        return this.getVersionConfig(versionName);
    }

    public getLatestVersionConfig(): VersionConfigurationSchema {
        const versionName = this.configuration.latestVersionName;
        return this.getVersionConfig(versionName);
    }
}
