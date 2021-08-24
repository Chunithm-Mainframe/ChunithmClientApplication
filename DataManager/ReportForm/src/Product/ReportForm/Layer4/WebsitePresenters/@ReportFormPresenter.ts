import { LogLevel } from "../../../../Packages/CustomLogger/CustomLogger";
import { CustomLogManager } from "../../../../Packages/CustomLogger/CustomLogManager";
import { DIProperty } from "../../../../Packages/DIProperty/DIProperty";
import { RoutingController } from "../../../../Packages/Router/RoutingController";
import { RoutingNode } from "../../../../Packages/Router/RoutingNode";
import { ReportFormConfiguration } from "../../Layer1/Configurations/@ReportFormConfiguration";
import { Role } from "../../Layer1/Role";
import { ReportFormPageLinkResolver } from "../../Layer2/ReportFormPageLinkResolver";
import { ReportFormModule } from "../../Layer3/Modules/@ReportFormModule";
import { UserAgentModule } from "../../Layer3/Modules/UserAgentModule";

export interface ReportFormWebsiteParameter extends Record<string, number | string> {
    version: string;
}

export class ReportFormWebsitePresenter<TParameter extends ReportFormWebsiteParameter> implements RoutingController {
    @DIProperty.inject(ReportFormConfiguration)
    protected readonly configuration: ReportFormConfiguration;

    @DIProperty.inject(ReportFormModule)
    private readonly module: ReportFormModule;

    @DIProperty.inject(ReportFormPageLinkResolver)
    private readonly pageLinkResolver: ReportFormPageLinkResolver;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected isAccessale(role: Role): boolean {
        return true;
    }

    private _targetGameVersion: string = null;
    protected get targetGameVersion(): string {
        return this._targetGameVersion;
    }

    public call(parameter: Readonly<TParameter>, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        if (!this.isAccessale(this.configuration.role)) {
            CustomLogManager.log(LogLevel.Error, `権限のないページにアクセスされました\n対象ページ: ${node.routingPath.resolvePath(parameter)}`);
            throw new Error("存在しないページが指定されました");
        }

        if (parameter.version) {
            this._targetGameVersion = parameter.version;
        }
        else {
            this._targetGameVersion = this.configuration.defaultVersionName;
        }

        return this.callInternal(parameter, node);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected callInternal(parameter: Readonly<TParameter>, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        throw new Error("Method not implemented.");
    }

    protected getModule<T extends ReportFormModule>(module: { new(): T }): T {
        return this.module.getModule(module);
    }

    protected readHtml(filePath: string): string {
        return HtmlService
            .createTemplateFromFile(filePath)
            .evaluate()
            .getContent();
    }

    protected replacePageLink<TParam extends ReportFormWebsiteParameter>(source: string, parameter: TParam, targetController: { prototype: RoutingController; name: string }) {
        const url = this.getFullPath(parameter, targetController);
        const linkTarget = new RegExp(`%link:${targetController.name}%`, 'g');
        return source ? source.replace(linkTarget, url) : "";
    }

    protected getFullPath<TParam extends ReportFormWebsiteParameter>(parameter: TParam, targetController: { prototype: RoutingController; name: string }): string {
        if (!parameter.version) {
            parameter.version = this.targetGameVersion;
        }
        return ReportFormWebsitePresenter.getFullPath(this.configuration, this.pageLinkResolver, targetController, parameter)
    }

    public static getFullPath<TParam extends ReportFormWebsiteParameter>(configuration: ReportFormConfiguration, pageLinkResolver: ReportFormPageLinkResolver, targetController: { prototype: RoutingController; name: string }, parameter: TParam): string {
        const path = this.getRelativePath(pageLinkResolver, targetController, parameter);
        return configuration.rootUrl + path;
    }

    public static getRelativePath<TParam extends ReportFormWebsiteParameter>(pageLinkResolver: ReportFormPageLinkResolver, targetController: { prototype: RoutingController; name: string }, parameter: TParam): string {
        const node = pageLinkResolver.getNode(targetController);
        const path = node.routingPath.resolvePath(parameter);
        return path;
    }

    protected createHtmlOutput(source: string): GoogleAppsScript.HTML.HtmlOutput {
        const htmlOutput = HtmlService.createHtmlOutput(source).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
        htmlOutput.setTitle('譜面定数 検証報告 管理ツール');
        return htmlOutput;
    }

    public static includeStylesheet(fileName: string): string {
        return HtmlService.createHtmlOutputFromFile(`Resources/Page/${fileName}`).getContent();
    }

    protected convertImageUrl(originUrl: string): string {
        if (this.getModule(UserAgentModule).IsReplaceImageUrlsPlatform()) {
            CustomLogManager.log(LogLevel.Debug, 'request replace ' + originUrl);
            const response = UrlFetchApp.fetch(originUrl, { followRedirects: false, muteHttpExceptions: false });
            return response?.getHeaders()?.['Location'];
        }
        return originUrl;
    }
}
