import { getConstValues } from "../../@const";
import { Configuration } from "../../Packages/Configuration/Configuration";
import { JsonConfigurationFactory } from "../../Packages/Configuration/JsonConfigurationFactory";
import { JsonFileRuntimeConfiguration } from "../../Packages/Configuration/JsonFileRuntimeConfiguration";
import { RuntimeConfiguration } from "../../Packages/Configuration/RuntimeConfiguration";
import { ScriptPropertyRuntimeConfiguration } from "../../Packages/Configuration/ScriptPropertyRuntimeConfiguration";
import { CustomCacheProvider } from "../../Packages/CustomCacheProvider/CustomCacheProvider";
import { ScriptCacheProvider } from "../../Packages/CustomCacheProvider/ScriptCacheProvider";
import { CustomLogManager } from "../../Packages/CustomLogger/CustomLogManager";
import { DIProperty } from "../../Packages/DIProperty/DIProperty";
import { Router } from "../../Packages/Router/Router";
import { RoutingController } from "../../Packages/Router/RoutingController";
import { LoggerDI } from "./Dependencies/Logger";
import { ReportFormConfiguration } from "./Layer1/Configurations/@ReportFormConfiguration";
import { ReportFormConfigurationSchema } from "./Layer1/Configurations/ConfigurationSchema";
import { ConfigurationSourceType } from "./Layer1/Configurations/ConfigurationSourceType";
import { RuntimeConfigurationSchema } from "./Layer1/Configurations/RuntimeConfigurationSchema";
import { NoticeQueue } from "./Layer2/@NoticeQueue";
import { ReportFormModule } from "./Layer2/Modules/@ReportFormModule";
import { ReportFormPageLinkResolver } from "./Layer3/@ReportFormPageLinkResolver";
import { BulkReportFormBuildLINEPostCommandController } from "./Layer3/LINEPostCommandControllers/BulkReportFormBuildLINEPostCommandController";
import { BulkReportFormUrlGetLINEPostCommandController } from "./Layer3/LINEPostCommandControllers/BulkReportFormUrlGetLINEPostCommandController";
import { DefaultGameVersionGetLINEPostCommandController } from "./Layer3/LINEPostCommandControllers/DefaultGameVersionGetLINEPostCommandController";
import { EnvironmentGetLINEPostCommandController } from "./Layer3/LINEPostCommandControllers/EnvironmentGetLINEPostCommandController";
import { FormUrlGetLINEPostCommandController } from "./Layer3/LINEPostCommandControllers/FormUrlGetLINEPostCommandController";
import { GlobalConfigValueGetLINEPostCommandController } from "./Layer3/LINEPostCommandControllers/GlobalConfigValueGetLINEPostCommandController";
import { LatestGameVersionGetLINEPostCommandController } from "./Layer3/LINEPostCommandControllers/LatestGameVersionGetLINEPostCommandController";
import { PostTweetEnabledGetLINEPostCommandController } from "./Layer3/LINEPostCommandControllers/PostTweetEnabledGetLINEPostCommandController";
import { PostTweetEnabledSetLINEPostCommandController } from "./Layer3/LINEPostCommandControllers/PostTweetEnabledSetLINEPostCommandController";
import { ReportFormBuildLINEPostCommandController } from "./Layer3/LINEPostCommandControllers/ReportFormBuildLINEPostCommandController";
import { ReportPostNoticeEnabledGetLINEPostCommandController } from "./Layer3/LINEPostCommandControllers/ReportPostNoticeEnabledGetLINEPostCommandController";
import { ReportPostNoticeEnabledSetLINEPostCommandController } from "./Layer3/LINEPostCommandControllers/ReportPostNoticeEnabledSetLINEPostCommandController";
import { TargetLevelMusicCountGetLINEPostCommandController } from "./Layer3/LINEPostCommandControllers/TargetLevelMusicCountGetLINEPostCommandController";
import { TestLINEPostCommandController } from "./Layer3/LINEPostCommandControllers/TestLINEPostCommandController";
import { TopUrlGetLINEPostCommandController } from "./Layer3/LINEPostCommandControllers/TopUrlGetLINEPostCommandController";
import { VersionGetLINEPostCommandController } from "./Layer3/LINEPostCommandControllers/VersionGetLINEPostCommandController";
import { LINEPostCommandManager } from "./Layer3/Managers/LINEPostCommandManager";
import { NoticeManager } from "./Layer3/Managers/NoticeManager";
import { PostCommandManager } from "./Layer3/Managers/PostCommandManager";
import { MusicRepositoryGetPostCommand } from "./Layer3/PostCommandControllers/MusicRepositoryGetPostCommand";
import { MusicRepositoryUpdatePostCommand } from "./Layer3/PostCommandControllers/MusicRepositoryUpdatePostCommand";
import { ReportFormWebsiteController, ReportFormWebsiteParameter } from "./Layer3/WebsiteControllers/@ReportFormController";
import { RoutingTreeBuilder } from "./Layer4/RoutingTreeBuilder";

export class Instance {
    private static _instance: Instance = null;
    public static get instance(): Instance {
        if (!this._instance) {
            const props = PropertiesService.getScriptProperties();
            const propTable = props.getProperties();
            const config = this.createReportFormConfiguration(propTable, props);
            this._instance = new Instance(config);
        }
        return this._instance;
    }

    public static initialize(): void {
        this.instance;
    }

    public get config() { return DIProperty.resolve(ReportFormConfiguration); }
    public get module() { return DIProperty.resolve(ReportFormModule); }

    public get linePostCommandManager() { return DIProperty.resolve(LINEPostCommandManager); }
    public get postCommandManager() { return DIProperty.resolve(PostCommandManager); }
    public get noticeManager() { return DIProperty.resolve(NoticeManager); }

    public static createCacheProvider(): CustomCacheProvider {
        const cacheProvider = new ScriptCacheProvider();
        cacheProvider.expirationInSeconds = 3600;
        return cacheProvider;
    }

    public static getNoticeQueue(): NoticeQueue {
        return new NoticeQueue(this.createCacheProvider());
    }

    private constructor(config: ReportFormConfiguration) {
        this.setupDIContainer(config);

        LoggerDI.initialize(config);

        //const webhookConfig = this.config.webhook;
        //this.module.getModule(WebhookModule).settingsManager = WebhookSettingsManager.readBySheet(
        //    webhookConfig.settingsSpreadsheetId,
        //    webhookConfig.settingsWorksheetName);
    }

    public static exception(error: Error): void {
        CustomLogManager.exception(error);
    }

    private setupDIContainer(config: ReportFormConfiguration): void {
        DIProperty.register(ReportFormConfiguration, config);

        const module = ReportFormModule.instantiate(config);
        DIProperty.register(ReportFormModule, module);

        DIProperty.register('CacheProvider', Instance.createCacheProvider());

        const router = new Router();
        const pageLinkResolver = new ReportFormPageLinkResolver();

        RoutingTreeBuilder.build(router.getTreeEditor(), pageLinkResolver);

        DIProperty.register(Router, router);
        DIProperty.register(ReportFormPageLinkResolver, pageLinkResolver);

        DIProperty.bind(NoticeQueue, () => Instance.getNoticeQueue());
        DIProperty.bind(NoticeManager, () => new NoticeManager());
    }

    public registerDoGetParameter(e: GoogleAppsScript.Events.DoGet): void {
        DIProperty.register("DoGet", e);
    }

    public setupLINEPostCommandControllers(): void {
        const linePostCommandManager = new LINEPostCommandManager();

        linePostCommandManager.bindStartWith('build-bulk-report-form<<', BulkReportFormBuildLINEPostCommandController);
        linePostCommandManager.bindEquals('bulk-report-form-url', BulkReportFormUrlGetLINEPostCommandController);
        linePostCommandManager.bindEquals('default-game-version', DefaultGameVersionGetLINEPostCommandController);
        linePostCommandManager.bindEquals('environment', EnvironmentGetLINEPostCommandController);
        linePostCommandManager.bindEquals('report-form-url', FormUrlGetLINEPostCommandController);
        linePostCommandManager.bindStartWith('get-global-config-value<<', GlobalConfigValueGetLINEPostCommandController);
        linePostCommandManager.bindEquals('latest-game-version', LatestGameVersionGetLINEPostCommandController);
        linePostCommandManager.bindEquals('post-tweet-enabled', PostTweetEnabledGetLINEPostCommandController);
        linePostCommandManager.bindStartWith('post-tweet-enabled=', PostTweetEnabledSetLINEPostCommandController);
        linePostCommandManager.bindStartWith('build-report-form<<', ReportFormBuildLINEPostCommandController);
        linePostCommandManager.bindEquals('report-post-notice-enabled', ReportPostNoticeEnabledGetLINEPostCommandController);
        linePostCommandManager.bindStartWith('report-post-notice-enabled=', ReportPostNoticeEnabledSetLINEPostCommandController);
        linePostCommandManager.bindStartWith('get-target-level-music-count<<', TargetLevelMusicCountGetLINEPostCommandController);
        linePostCommandManager.bindStartWith('test-', TestLINEPostCommandController);
        linePostCommandManager.bindEquals('top-url', TopUrlGetLINEPostCommandController);
        linePostCommandManager.bindEquals('version', VersionGetLINEPostCommandController);

        DIProperty.register(LINEPostCommandManager, linePostCommandManager);
    }

    public setupPostCommandControllers(): void {
        const postCommandManager = new PostCommandManager();

        postCommandManager.bindEquals("repo/get", MusicRepositoryGetPostCommand);
        postCommandManager.bindEquals("repo/update", MusicRepositoryUpdatePostCommand);

        DIProperty.register(PostCommandManager, postCommandManager);
    }

    private static createReportFormConfiguration(propTable: { [key: string]: string }, props: GoogleAppsScript.Properties.Properties) {
        const config = this.createStaticConfiguration(propTable);
        const runtimeConfig = this.createRuntimeConfiguration(props);
        const reportFormConfig = new ReportFormConfiguration(config, runtimeConfig);
        return reportFormConfig;
    }

    private static createStaticConfiguration(propTable: { [key: string]: string }): Configuration<ReportFormConfigurationSchema> {
        switch (getConstValues().configurationSourceType) {
            case ConfigurationSourceType.ScriptProperties:
                return JsonConfigurationFactory.create(propTable['config']);
            case ConfigurationSourceType.Json:
                return JsonConfigurationFactory.createByFile(getConstValues().configurationJsonFileId);
        }
    }

    private static createRuntimeConfiguration(props: GoogleAppsScript.Properties.Properties): RuntimeConfiguration<RuntimeConfigurationSchema> {
        switch (getConstValues().runtimeConfigurationSourceType) {
            case ConfigurationSourceType.ScriptProperties:
                return new ScriptPropertyRuntimeConfiguration(props, 'runtime_config');
            case ConfigurationSourceType.Json:
                return JsonFileRuntimeConfiguration.createByFileId(getConstValues().runtimeConfigurationJsonFileId);
        }
    }

    public getPageUrl<TParam extends ReportFormWebsiteParameter>(targetController: { prototype: RoutingController; name: string }, parameter: TParam): string {
        const configuration = DIProperty.resolve(ReportFormConfiguration);
        const pageLinkResolver = DIProperty.resolve(ReportFormPageLinkResolver);
        return ReportFormWebsiteController.getFullPath(configuration, pageLinkResolver, targetController, parameter);
    }
}
