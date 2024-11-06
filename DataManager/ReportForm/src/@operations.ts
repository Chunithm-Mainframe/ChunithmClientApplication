/* eslint @typescript-eslint/no-unused-vars: off */

function storeConfig() {
    Operations.storeConfig();
    Operations.storeRuntimeConfig();
}

function execute<T>(action: (instance: Instance) => T) {
    return Operations.execute(action);
}

function dumpRuntimeConfig() {
    execute(instance => {
        console.log(instance.config.runtime);
    });
}

function getDefaultVersionName(instance: Instance): string {
    return instance.module.configuration.defaultVersionName;
}

function buildUnitReportGroupByGenreForm() {
    execute(instance => {
        const versionName = getDefaultVersionName(instance);
        instance.module.getModule(ReportModule).buildUnitReportGroupByGenreForm(versionName);
    });
}

function buildUnitReportGroupByLevelForm() {
    execute(instance => {
        const versionName = getDefaultVersionName(instance);
        instance.module.getModule(ReportModule).buildUnitReportGroupByLevelForm(versionName);
    });
}

function buildLevelReportForm() {
    execute(instance => {
        const versionName = getDefaultVersionName(instance);
        instance.module.getModule(ReportModule).buildLevelReportForm(versionName);
    });
}

function updateMusics() {
    execute(instance => {
        const versionName = getDefaultVersionName(instance);

        CustomLogManager.log(LogLevel.Info, 'ジャンル別単曲検証報告フォームの楽曲リスト更新開始');
        instance.module.getModule(ReportModule).updateMusicsUnitReportGroupByGenreForm(versionName);
        CustomLogManager.log(LogLevel.Info, '完了');

        CustomLogManager.log(LogLevel.Info, 'レベル別単曲検証報告フォームの楽曲リスト更新開始');
        instance.module.getModule(ReportModule).updateMusicsUnitReportForm(versionName);
        CustomLogManager.log(LogLevel.Info, '完了');
    })
}

function authorizeTwitter() {
    execute(instance => instance.module.getModule(TwitterModule).connector.authorize());
}

function authCallback(request) {
    execute(instance => instance.module.getModule(TwitterModule).connector.authCallback(request));
}

function getGenres(): string[] {
    return execute(instance => {
        const versionName = getDefaultVersionName(instance);
        const genres: string[] = [];
        const musics = Instance.instance.module.getModule(MusicModule).getMusicTable(versionName).records;
        for (const m of musics) {
            const genre = m.genre;
            if (genres.indexOf(genre) === -1) {
                genres.push(genre);
            }
        }

        CustomLogManager.log(
            LogLevel.Info,
            {
                versionName: versionName,
                genres: genres,
            });

        return genres;
    });
}

function dumpNoticeQueue() {
    const queue = Instance.getNoticeQueue();
    queue.dump();
}

function notifyUnverified() {
    Operations.notifyUnverified();
}

function importBulkReportSheet() {
    try {
        Instance.initialize();
        CustomLogManager.log(LogLevel.Info, "開始: importBulkReportSheet");
        const versionName = Instance.instance.module.configuration.defaultVersionName;
        Instance.instance.module.getModule(ReportModule).importBulkReport(versionName);
        CustomLogManager.log(LogLevel.Info, "完了: importBulkReportSheet");
    }
    catch (e) {
        Instance.exception(e);
    }
}

function updateCurrentVersionBulkReportTable() {
    try {
        Instance.initialize();

        CustomLogManager.log(LogLevel.Info, "開始: updateCurrentVersionBulkReportSheet");

        const config = Instance.instance.module.configuration;
        const versionName = config.defaultVersionName;
        const prevVersionName = config.getPreviousVersionName(versionName);

        const spreadsheetId = Instance.instance.module.getModule(VersionModule)
            .getVersionConfig(versionName)
            .bulkReportSpreadsheetId;
        const reader = new BulkReportTableReader();
        const container = reader.read(spreadsheetId, 'Header', 'BASIC', 'ADVANCED', 'EXPERT', 'MASTER');
        const musicModule = Instance.instance.module.getModule(MusicModule);
        container.update(
            musicModule.getMusicTable(versionName),
            musicModule.getMusicTable(prevVersionName));
        const writer = new BulkReportTableWriter();
        writer.write(spreadsheetId, container);

        CustomLogManager.log(LogLevel.Info, "完了: updateCurrentVersionBulkReportSheet");
    }
    catch (e) {
        Instance.exception(e);
    }
}

function updateNextVersionBulkReportTable() {
    try {
        Instance.initialize();

        CustomLogManager.log(LogLevel.Info, "開始: updateNextVersionBulkReportTable");

        const config = Instance.instance.module.configuration;
        const versionName = config.defaultVersionName;

        const spreadsheetId = Instance.instance.module.getModule(VersionModule)
            .getVersionConfig(versionName)
            .nextVersionBulkReportSpreadsheetId;
        const reader = new BulkReportTableReader();
        const container = reader.read(spreadsheetId, 'Header', 'BASIC', 'ADVANCED', 'EXPERT', 'MASTER');
        const repository = Instance.instance.module.getModule(MusicModule).getMusicTable(versionName);
        container.update(repository, repository);
        const writer = new BulkReportTableWriter();
        writer.write(spreadsheetId, container);

        CustomLogManager.log(LogLevel.Info, "完了: updateNextVersionBulkReportTable");
    }
    catch (e) {
        Instance.exception(e);
    }
}

function tweetTestMessage() {
    execute(instance => {
        const message = `テストツイート
これは、うにボットからの送信機能を確認するためのツイートです
${new Date()}`
        instance.module.getModule(TwitterModule).postTweet(message);
    });
}

function dumpMusicJsonHash() {
    console.log(PropertiesService.getScriptProperties().getProperty('music_json_hash'));
}

function clearMusicJsonHash() {
    PropertiesService.getScriptProperties().deleteProperty('music_json_hash');
}
