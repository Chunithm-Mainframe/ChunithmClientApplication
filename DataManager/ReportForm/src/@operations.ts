import { LogLevel } from "./Packages/CustomLogger/CustomLogger";
import { CustomLogManager } from "./Packages/CustomLogger/CustomLogManager";
import { Block } from "./Packages/UrlFetch.Slack/API/Blocks";
import { SlackChatPostMessageStream } from "./Packages/UrlFetch.Slack/API/Chat/PostMessage/Stream";
import { SlackBlockFactory } from "./Packages/UrlFetch.Slack/BlockFactory";
import { SlackCompositionObjectFactory } from "./Packages/UrlFetch.Slack/CompositionObjectFactory";
import { UrlFetchManager } from "./Packages/UrlFetch/UrlFetchManager";
import { Instance } from "./Product/ReportForm/Instance";
import { ConfigurationEditor } from "./Product/ReportForm/Layer1/Configurations/ConfigurationEditor";
import { BulkReportTableReader } from "./Product/ReportForm/Layer2/Report/BulkReport/BulkReportTableReader";
import { BulkReportTableWriter } from "./Product/ReportForm/Layer2/Report/BulkReport/BulkReportTableWriter";
import { ReportStatus } from "./Product/ReportForm/Layer2/Report/ReportStatus";
import { MusicModule } from "./Product/ReportForm/Layer3/Modules/MusicModule";
import { ReportModule } from "./Product/ReportForm/Layer3/Modules/Report/ReportModule";
import { TwitterModule } from "./Product/ReportForm/Layer3/Modules/TwitterModule";
import { VersionModule } from "./Product/ReportForm/Layer3/Modules/VersionModule";
import { LevelReportListWebsitePresenter } from "./Product/ReportForm/Layer4/WebsitePresenters/LevelReport/LevelReportListWebsitePresenter";
import { UnitReportListWebsitePresenter } from "./Product/ReportForm/Layer4/WebsitePresenters/UnitReport/UnitReportListWebsitePresenter";

/* eslint @typescript-eslint/no-unused-vars: off */

export function storeConfig(): GoogleAppsScript.Properties.Properties {
    const ret = ConfigurationEditor.storeConfig();
    CustomLogManager.log(LogLevel.Info, ret.getProperties());
    return ret;
}

export function storeRuntimeConfig(): GoogleAppsScript.Properties.Properties {
    const ret = ConfigurationEditor.storeRuntimeConfig();
    CustomLogManager.log(LogLevel.Info, ret.getProperties());
    return ret;
}

export function execute<T>(action: (instance: Instance) => T) {
    try {
        Instance.initialize();
        return action(Instance.instance);
    }
    catch (e) {
        Instance.exception(e);
    }
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

export function noticeCreatedUnitReports() {
    const queue = Instance.getNoticeQueue();
    const reportIds = queue.dequeueCreateUnitReport(10);
    if (reportIds.length > 0) {
        queue.save();
        execute(instance => {
            const versionName = getDefaultVersionName(instance);
            instance.noticeManager.noticeCreateUnitReport(versionName, reportIds);
        });
    }
}

export function noticeApprovedUnitReports() {
    const queue = Instance.getNoticeQueue();
    const reportIds = queue.dequeueApproveUnitReport(10);
    if (reportIds.length > 0) {
        queue.save();
        execute(instance => {
            const versionName = getDefaultVersionName(instance);
            instance.noticeManager.noticeApproveUnitReport(versionName, reportIds);
        });
    }
}

export function noticeRejectedUnitReports() {
    const queue = Instance.getNoticeQueue();
    const reportIds = queue.dequeueRejectUnitReport(10);
    if (reportIds.length > 0) {
        queue.save();
        execute(instance => {
            const versionName = getDefaultVersionName(instance);
            instance.noticeManager.noticeRejectUnitReport(versionName, reportIds);
        });
    }
}

export function noticeCreatedLevelReports() {
    const queue = Instance.getNoticeQueue();
    const reportIds = queue.dequeueCreateLevelReport(10);
    if (reportIds.length > 0) {
        queue.save();
        execute(instance => {
            const versionName = getDefaultVersionName(instance);
            instance.noticeManager.noticeCreateLevelReport(versionName, reportIds);
        });
    }
}

export function noticeApprovedLevelReports() {
    const queue = Instance.getNoticeQueue();
    const reportIds = queue.dequeueApproveLevelReport(10);
    if (reportIds.length > 0) {
        queue.save();
        execute(instance => {
            const versionName = getDefaultVersionName(instance);
            instance.noticeManager.noticeApproveLevelReport(versionName, reportIds);
        });
    }
}

export function noticeRejectedLevelReports() {
    const queue = Instance.getNoticeQueue();
    const reportIds = queue.dequeueRejectLevelReport(10);
    if (reportIds.length > 0) {
        queue.save();
        execute(instance => {
            const versionName = getDefaultVersionName(instance);
            instance.noticeManager.noticeRejectLevelReport(versionName, reportIds);
        });
    }
}

export function notifyUnverified() {
    try {
        Instance.initialize();

        const versionName = Instance.instance.module.configuration.defaultVersionName;
        const reports = Instance.instance.module.getModule(ReportModule).getUnitReports(versionName);
        let wipReportCount = 0;
        for (let i = 0; i < reports.length; i++) {
            if (reports[i].reportStatus === ReportStatus.InProgress) {
                wipReportCount++;
            }
        }

        const levelReports = Instance.instance.module.getModule(ReportModule).getLevelReports(versionName);
        let wipLevelReportCount = 0;
        for (const levelReport of levelReports) {
            if (levelReport.reportStatus === ReportStatus.InProgress) {
                wipLevelReportCount++;
            }
        }

        if (wipReportCount > 0 || wipLevelReportCount > 0) {
            const blocks: Block[] = [];
            blocks.push(SlackBlockFactory.section(
                SlackCompositionObjectFactory.markdownText('*[定期]未検証 件数報告*')
            ));
            if (wipReportCount > 0) {
                const wipReportsUrl = Instance.instance.getPageUrl(UnitReportListWebsitePresenter, { version: versionName });
                blocks.push(SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`:page_with_curl:未承認の単曲検証報告が${wipReportCount}件あります
<${wipReportsUrl}|検証報告一覧(単曲)ページへ>`)
                ));
                blocks.push(SlackBlockFactory.divider());
            }
            if (wipLevelReportCount > 0) {
                const wipBulkReporturl = Instance.instance.getPageUrl(LevelReportListWebsitePresenter, { version: versionName });
                blocks.push(SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`:page_with_curl:未承認のレベル別検証報告が${wipLevelReportCount}件あります
<${wipBulkReporturl}|検証報告一覧(レベル別)ページへ>`)
                ))
                blocks.push(SlackBlockFactory.divider());
            }
            UrlFetchManager.execute([new SlackChatPostMessageStream({
                token: Instance.instance.module.configuration.global.slackApiToken,
                channel: Instance.instance.module.configuration.global.slackChannelIdTable['noticeWipReportCount'],
                text: '[定期]未承認 件数報告',
                blocks: blocks,
            })]);
        }
    }
    catch (e) {
        Instance.exception(e);
    }
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
