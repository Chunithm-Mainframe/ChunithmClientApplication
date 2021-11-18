import { LogLevel } from "../../../Packages/CustomLogger/CustomLogger";
import { CustomLogManager } from "../../../Packages/CustomLogger/CustomLogManager";
import { Block } from "../../../Packages/UrlFetch.Slack/API/Blocks";
import { SlackChatPostMessageStream } from "../../../Packages/UrlFetch.Slack/API/Chat/PostMessage/Stream";
import { SlackBlockFactory } from "../../../Packages/UrlFetch.Slack/BlockFactory";
import { SlackCompositionObjectFactory } from "../../../Packages/UrlFetch.Slack/CompositionObjectFactory";
import { UrlFetchManager } from "../../../Packages/UrlFetch/UrlFetchManager";
import { Instance } from "../Instance";
import { ConfigurationEditor } from "../Layer1/Configurations/ConfigurationEditor";
import { Environment } from "../Layer1/Environment";
import { ReportStatus } from "../Layer2/Report/ReportStatus";
import { ReportModule } from "../Layer3/Modules/Report/ReportModule";
import { LevelReportListWebsitePresenter } from "./WebsitePresenters/LevelReport/LevelReportListWebsitePresenter";
import { UnitReportListWebsitePresenter } from "./WebsitePresenters/UnitReport/UnitReportListWebsitePresenter";

export class Operations {
    public static storeConfig(): GoogleAppsScript.Properties.Properties {
        const ret = ConfigurationEditor.storeConfig();
        CustomLogManager.log(LogLevel.Info, ret.getProperties());
        return ret;
    }

    public static storeRuntimeConfig(): GoogleAppsScript.Properties.Properties {
        const ret = ConfigurationEditor.storeRuntimeConfig();
        CustomLogManager.log(LogLevel.Info, ret.getProperties());
        return ret;
    }

    public static execute<T>(action: (instance: Instance) => T) {
        try {
            Instance.initialize();
            return action(Instance.instance);
        }
        catch (e) {
            Instance.exception(e);
        }
    }

    private static getDefaultVersionName(instance: Instance) {
        return instance.module.configuration.defaultVersionName;
    }

    public static noticeUpdateMusics() {
        const queue = Instance.getNoticeQueue();
        const musics = queue.dequeueUpdateMusic(10);
        if (musics.length > 0) {
            queue.save();
            this.execute(instance => {
                const versionName = this.getDefaultVersionName(instance);
                instance.noticeManager.noticeUpdateMusic(versionName, musics);
            });
        }
    }

    public static noticeCreatedUnitReports() {
        const queue = Instance.getNoticeQueue();
        const reportIds = queue.dequeueCreateUnitReport(10);
        if (reportIds.length > 0) {
            queue.save();
            this.execute(instance => {
                const versionName = this.getDefaultVersionName(instance);
                instance.noticeManager.noticeCreateUnitReport(versionName, reportIds);
            });
        }
    }

    public static noticeApprovedUnitReports() {
        const queue = Instance.getNoticeQueue();
        const reportIds = queue.dequeueApproveUnitReport(10);
        if (reportIds.length > 0) {
            queue.save();
            this.execute(instance => {
                const versionName = this.getDefaultVersionName(instance);
                instance.noticeManager.noticeApproveUnitReport(versionName, reportIds);
            });
        }
    }

    public static noticeRejectedUnitReports() {
        const queue = Instance.getNoticeQueue();
        const reportIds = queue.dequeueRejectUnitReport(10);
        if (reportIds.length > 0) {
            queue.save();
            this.execute(instance => {
                const versionName = this.getDefaultVersionName(instance);
                instance.noticeManager.noticeRejectUnitReport(versionName, reportIds);
            });
        }
    }

    public static noticeCreatedLevelReports() {
        const queue = Instance.getNoticeQueue();
        const reportIds = queue.dequeueCreateLevelReport(10);
        if (reportIds.length > 0) {
            queue.save();
            this.execute(instance => {
                const versionName = this.getDefaultVersionName(instance);
                instance.noticeManager.noticeCreateLevelReport(versionName, reportIds);
            });
        }
    }

    public static noticeApprovedLevelReports() {
        const queue = Instance.getNoticeQueue();
        const reportIds = queue.dequeueApproveLevelReport(10);
        if (reportIds.length > 0) {
            queue.save();
            this.execute(instance => {
                const versionName = this.getDefaultVersionName(instance);
                instance.noticeManager.noticeApproveLevelReport(versionName, reportIds);
            });
        }
    }

    public static noticeRejectedLevelReports() {
        const queue = Instance.getNoticeQueue();
        const reportIds = queue.dequeueRejectLevelReport(10);
        if (reportIds.length > 0) {
            queue.save();
            this.execute(instance => {
                const versionName = this.getDefaultVersionName(instance);
                instance.noticeManager.noticeRejectLevelReport(versionName, reportIds);
            });
        }
    }

    public static notifyUnverified() {
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

    public static fetchMusicJson() {
        try {
            Instance.initialize();

            if (Instance.instance.config.environment !== Environment.Develop) {
                return;
            }

            const scriptCache = CacheService.getScriptCache();
            const cachedHash = scriptCache.get('music_json_hash');
            const musicJson = UrlFetchApp.fetch("https://chunithm.sega.jp/storage/json/music_new.json").getContentText();
            const newHash = this.MD5(musicJson);

            if (cachedHash !== newHash) {
                scriptCache.put('music_json_hash', newHash);

                const blocks: Block[] = [];
                blocks.push(SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText('music_new.jsonが更新されました')
                ));
                UrlFetchManager.execute([new SlackChatPostMessageStream({
                    token: Instance.instance.module.configuration.global.slackApiToken,
                    channel: Instance.instance.module.configuration.global.slackChannelIdTable['updateMusicJson'],
                    text: '',
                    blocks: blocks,
                })]);
            }
        }
        catch (e) {
            Instance.exception(e);
        }
    }

    private static MD5(input) {
        const rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, input, Utilities.Charset.UTF_8);
        let txtHash = '';
        for (let i = 0; i < rawHash.length; i++) {
            let hashVal = rawHash[i];
            if (hashVal < 0) {
                hashVal += 256;
            }
            if (hashVal.toString(16).length == 1) {
                txtHash += '0';
            }
            txtHash += hashVal.toString(16);
        }
        return txtHash;
    }
}
