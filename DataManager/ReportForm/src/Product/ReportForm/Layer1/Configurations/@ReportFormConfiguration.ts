import { getConstValues } from "../../../../@const";
import { Configuration } from "../../../../Packages/Configuration/Configuration";
import { RuntimeConfiguration } from "../../../../Packages/Configuration/RuntimeConfiguration";
import { Environment } from "../Environment";
import { Role } from "../Role";
import { GlobalConfigurationSchema, ReportFormConfigurationSchema, VersionConfigurationSchema, WebhookConfigurationSchema } from "./ConfigurationSchema";
import { RuntimeConfigurationSchema } from "./RuntimeConfigurationSchema";

export class ReportFormConfiguration {
    public constructor(
        private readonly _config: Configuration<ReportFormConfigurationSchema>,
        private readonly _runtime: RuntimeConfiguration<RuntimeConfigurationSchema>) {
    }

    public get runtime(): RuntimeConfigurationSchema {
        return this._runtime.properties;
    }

    public applyRuntimeConfiguration(): void {
        this._runtime.apply();
    }

    public get global(): GlobalConfigurationSchema {
        return this._config.properties.global;
    }

    public get versions(): Record<string, VersionConfigurationSchema> {
        return this._config.properties.versions;
    }

    public get webhook(): WebhookConfigurationSchema {
        return this._config.properties.webhook;
    }

    public get environment(): Environment { return getConstValues().environment; }

    private _overrideRootUrl: string = null;
    public get rootUrl(): string {
        return this._overrideRootUrl
            ? this._overrideRootUrl
            : this.global.rootUrl;
    }

    public overrideRootUrl(rootUrl: string): void {
        this._overrideRootUrl = rootUrl;
    }

    private _overrideRole: Role = -1;
    public get role(): Role {
        return this._overrideRole >= 0
            ? this._overrideRole
            : this.global.role;
    }

    public overrideRole(role: Role): void {
        this._overrideRole = role;
    }

    public get defaultVersionName(): string {
        const versionName = this.global.defaultVersionName;
        if (!versionName) {
            return this.latestVersionName;
        }
        return versionName;
    }

    public get latestVersionName(): string {
        return this.versionNames[this.versionNames.length - 1];
    }

    private _versionNames: string[];
    public get versionNames(): string[] {
        if (!this._versionNames) {
            this._versionNames = Object.keys(this.versions);
        }
        return this._versionNames;
    }

    public getPreviousVersionName(currentVersionName: string): string {
        for (let i = 1; i < this.versionNames.length; i++) {
            if (this.versionNames[i] === currentVersionName) {
                return this.versionNames[i - 1];
            }
        }
        return '';
    }
}
