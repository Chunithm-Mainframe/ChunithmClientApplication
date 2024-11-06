class Instance {
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
    public get noticeQueue() { return DIProperty.resolve(NoticeQueue); }
    public get noticeManager() { return DIProperty.resolve(NoticeManager); }

    private static createCacheProvider(): CustomCacheProvider {
        const cacheProvider = new ScriptCacheProvider();
        cacheProvider.expirationInSeconds = 3600;
        return cacheProvider;
    }

    public static getNoticeQueue(): NoticeQueue {
        return new NoticeQueue(this.createCacheProvider());
    }

    private constructor(config: ReportFormConfiguration) {
        this.setupDIContainer(config);

        CustomLogManager.isDevelopment = config.environment === Environment.Develop;
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

        const cacheProvider = Instance.createCacheProvider();
        DIProperty.register('CacheProvider', cacheProvider);

        const router = new Router();
        const pageLinkResolver = new ReportFormPageLinkResolver();

        RoutingTreeBuilder.build(router.getTreeEditor(), pageLinkResolver);

        DIProperty.register(Router, router);
        DIProperty.register(ReportFormPageLinkResolver, pageLinkResolver);

        DIProperty.bind(NoticeQueue, () => new NoticeQueue(cacheProvider));
        DIProperty.bind(NoticeManager, () => new NoticeManager());
    }

    public registerDoGetParameter(e: GoogleAppsScript.Events.DoGet): void {
        DIProperty.register("DoGet", e);
    }

    public setupLINEPostCommands(): void {
        const linePostCommandManager = new LINEPostCommandManager();

        linePostCommandManager.bindStartWith('build-bulk-report-form<<', BulkReportFormBuildLINEPostCommand);
        linePostCommandManager.bindEquals('bulk-report-form-url', BulkReportFormUrlGetLINEPostCommand);
        linePostCommandManager.bindEquals('default-game-version', DefaultGameVersionGetLINEPostCommand);
        linePostCommandManager.bindEquals('environment', EnvironmentGetLINEPostCommand);
        linePostCommandManager.bindEquals('report-form-url', FormUrlGetLINEPostCommand);
        linePostCommandManager.bindStartWith('get-global-config-value<<', GlobalConfigValueGetLINEPostCommand);
        linePostCommandManager.bindEquals('latest-game-version', LatestGameVersionGetLINEPostCommand);
        linePostCommandManager.bindEquals('post-tweet-enabled', PostTweetEnabledGetLINEPostCommand);
        linePostCommandManager.bindStartWith('post-tweet-enabled=', PostTweetEnabledSetLINEPostCommand);
        linePostCommandManager.bindStartWith('build-report-form<<', ReportFormBuildLINEPostCommand);
        linePostCommandManager.bindEquals('report-post-notice-enabled', ReportPostNoticeEnabledGetLINEPostCommand);
        linePostCommandManager.bindStartWith('report-post-notice-enabled=', ReportPostNoticeEnabledSetLINEPostCommand);
        linePostCommandManager.bindStartWith('get-target-level-music-count<<', TargetLevelMusicCountGetLINEPostCommand);
        linePostCommandManager.bindStartWith('test-', TestLINEPostCommand);
        linePostCommandManager.bindEquals('top-url', TopUrlGetLINEPostCommand);
        linePostCommandManager.bindEquals('version', VersionGetLINEPostCommand);

        DIProperty.register(LINEPostCommandManager, linePostCommandManager);
    }

    public setupPostCommands(): void {
        const postCommandManager = new PostCommandManager();

        postCommandManager.bindEquals("table/get", MusicTableGetPostCommand);
        postCommandManager.bindEquals("table/update", MusicTableUpdatePostCommand);
        postCommandManager.bindEquals("music/update", MusicUpdatePostCommand);
        postCommandManager.bindEquals("playerRating/table/get", PlayerRatingGetPostCommand);

        DIProperty.register(PostCommandManager, postCommandManager);
    }

    private static createReportFormConfiguration(propTable: { [key: string]: string }, props: GoogleAppsScript.Properties.Properties) {
        const config = this.createStaticConfiguration(propTable);
        const runtimeConfig = this.createRuntimeConfiguration(props);
        const reportFormConfig = new ReportFormConfiguration(config, runtimeConfig);
        return reportFormConfig;
    }

    private static createStaticConfiguration(propTable: { [key: string]: string }): Configuration<ReportForm.ConfigurationSchema> {
        switch (ReportFormConstants.getConstValues().configurationSourceType) {
            case ConfigurationSourceType.ScriptProperties:
                return JsonConfiguration.create(propTable['config']);
            case ConfigurationSourceType.Json:
                return JsonConfiguration.createByFile(ReportFormConstants.getConstValues().configurationJsonFileId);
        }
    }

    private static createRuntimeConfiguration(props: GoogleAppsScript.Properties.Properties): RuntimeConfiguration<ReportForm.RuntimeConfigurationSchema> {
        switch (ReportFormConstants.getConstValues().runtimeConfigurationSourceType) {
            case ConfigurationSourceType.ScriptProperties:
                return new ScriptPropertyRuntimeConfiguration(props, 'runtime_config');
            case ConfigurationSourceType.Json:
                return JsonFileRuntimeConfiguration.createByFileId(ReportFormConstants.getConstValues().runtimeConfigurationJsonFileId);
        }
    }

    public getPageUrl<TParam extends ReportFormWebsiteParameter>(targetController: { prototype: RoutingController; name: string }, parameter: TParam): string {
        const configuration = DIProperty.resolve(ReportFormConfiguration);
        const pageLinkResolver = DIProperty.resolve(ReportFormPageLinkResolver);
        return ReportFormWebsitePresenter.getFullPath(configuration, pageLinkResolver, targetController, parameter);
    }
}
