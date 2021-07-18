import { LogLevel } from "../../../../Packages/CustomLogger/CustomLogger";
import { CustomLogManager } from "../../../../Packages/CustomLogger/CustomLogManager";
import { DIProperty } from "../../../../Packages/DIProperty/DIProperty";
import { Router } from "../../../../Packages/Router/Router";
import { RoutingNode } from "../../../../Packages/Router/RoutingNode";
import { ReportFormConfiguration } from "../../Layer1/Configurations/@ReportFormConfiguration";
import { Role } from "../../Layer1/Role";
import { ReportFormModule } from "../../Layer2/Modules/@ReportFormModule";
import { RoutingController } from "../../../../Packages/Router/RoutingController";

export interface ReportFormWebsiteParameter extends Record<string, number | string> {
    version: string;
}

export class ReportFormWebsiteController<TParameter extends ReportFormWebsiteParameter> implements RoutingController {
    @DIProperty.inject(ReportFormConfiguration)
    protected readonly configuration: ReportFormConfiguration;

    @DIProperty.inject(ReportFormModule)
    private readonly module: ReportFormModule;

    @DIProperty.inject(Router)
    private readonly router: Router;

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
        return ReportFormWebsiteController.getFullPath(this.configuration, this.router, targetController, parameter)
    }

    public static getFullPath<TParam extends ReportFormWebsiteParameter>(configuration: ReportFormConfiguration, router: Router, targetController: { prototype: RoutingController; name: string }, parameter: TParam): string {
        const path = this.getRelativePath(router, targetController, parameter);
        return configuration.rootUrl + path;
    }

    public static getRelativePath<TParam extends ReportFormWebsiteParameter>(router: Router, targetController: { prototype: RoutingController; name: string }, parameter: TParam): string {
        const node = router.getTreeEditor().build(targetController.name).node;
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
}
