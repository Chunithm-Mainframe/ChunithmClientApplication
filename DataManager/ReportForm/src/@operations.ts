import { LogLevel } from "./Packages/CustomLogger/CustomLogger";
import { CustomLogManager } from "./Packages/CustomLogger/CustomLogManager";
import { Instance } from "./Product/ReportForm/Instance";
import { BulkReportTableReader } from "./Product/ReportForm/Layer2/Report/BulkReport/BulkReportTableReader";
import { BulkReportTableWriter } from "./Product/ReportForm/Layer2/Report/BulkReport/BulkReportTableWriter";
import { MusicModule } from "./Product/ReportForm/Layer3/Modules/MusicModule";
import { ReportModule } from "./Product/ReportForm/Layer3/Modules/Report/ReportModule";
import { TwitterModule } from "./Product/ReportForm/Layer3/Modules/TwitterModule";
import { VersionModule } from "./Product/ReportForm/Layer3/Modules/VersionModule";
import { Operations } from "./Product/ReportForm/Layer4/Operations";

/* eslint @typescript-eslint/no-unused-vars: off */

function storeConfig() {
    Operations.storeConfig();
    Operations.storeRuntimeConfig();
}

function execute<T>(action: (instance: Instance) => T) {
    return Operations.execute(action);
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
