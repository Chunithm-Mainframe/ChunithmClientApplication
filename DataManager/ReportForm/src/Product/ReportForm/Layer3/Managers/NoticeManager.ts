import { DIProperty } from "../../../../Packages/DIProperty/DIProperty";
import { Router } from "../../../../Packages/Router/Router";
import { LINEMessagePushStream } from "../../../../Packages/UrlFetch.LINE/API/Message/Push/Stream";
import { TextMessage } from "../../../../Packages/UrlFetch.LINE/API/MessageObjects";
import { Block } from "../../../../Packages/UrlFetch.Slack/API/Blocks";
import { SlackChatPostMessageStream } from "../../../../Packages/UrlFetch.Slack/API/Chat/PostMessage/Stream";
import { SlackBlockFactory } from "../../../../Packages/UrlFetch.Slack/BlockFactory";
import { SlackCompositionObjectFactory } from "../../../../Packages/UrlFetch.Slack/CompositionObjectFactory";
import { UrlFetchStream } from "../../../../Packages/UrlFetch/UrlFetch";
import { UrlFetchManager } from "../../../../Packages/UrlFetch/UrlFetchManager";
import { ReportFormConfiguration } from "../../Layer1/Configurations/@ReportFormConfiguration";
import { ReportFormModule } from "../../Layer2/Modules/@ReportFormModule";
import { ReportModule } from "../../Layer2/Modules/Report/ReportModule";
import { TwitterModule } from "../../Layer2/Modules/TwitterModule";
import { VersionModule } from "../../Layer2/Modules/VersionModule";
import { Difficulty } from "../../Layer2/MusicDataTable/Difficulty";
import { IReport } from "../../Layer2/Report/IReport";
import { LevelBulkReport } from "../../Layer2/Report/LevelBulkReport/LevelBulkReport";
import { Utility } from "../../Layer2/Utility";
import { ReportFormWebsiteController } from "../WebsiteControllers/@ReportFormController";
import { LevelReportWebsiteController } from "../WebsiteControllers/LevelReport/LevelReportWebsiteController";
import { UnitReportWebsiteController } from "../WebsiteControllers/UnitReport/UnitReportWebsiteController";
import { ReportFormPageLinkResolver } from "../@ReportFormPageLinkResolver";



export class NoticeManager {
    @DIProperty.inject(ReportFormModule)
    private readonly _module: ReportFormModule;

    private get reportModule(): ReportModule { return this._module.getModule(ReportModule); }
    private get twitterModule(): TwitterModule { return this._module.getModule(TwitterModule); }
    private get versionModule(): VersionModule { return this._module.getModule(VersionModule); }

    private get configuration(): ReportFormConfiguration { return this._module.configuration; }

    @DIProperty.inject(ReportFormPageLinkResolver)
    private readonly _pageLinkResolver: ReportFormPageLinkResolver;

    public noticeCreateUnitReport(versionName: string, reportIds: number[]): void {
        if (reportIds.length === 0) {
            return;
        }
        const reports: IReport[] = [];
        const missingReportIds: number[] = [];
        for (const id of reportIds) {
            const r = this.reportModule.getReport(versionName, id);
            if (r) {
                reports.push(r);
            }
            else {
                missingReportIds.push(id);
            }
        }

        const errors: Error[] = [];

        // 通知処理
        // slack
        {
            const blocks: Block[] = [];
            blocks.push(SlackBlockFactory.section(
                SlackCompositionObjectFactory.markdownText(`:mailbox_with_mail: *新規単曲検証報告(${reports.length}件)*`)
            ));
            for (const r of reports) {
                const diffText = Utility.toDifficultyTextLowerCase(r.difficulty);
                const url = ReportFormWebsiteController.getFullPath(this.configuration, this._pageLinkResolver, UnitReportWebsiteController, { version: versionName, reportId: r.reportId.toString() });
                blocks.push(SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`<${url}|:chunithm_difficulty_${diffText}: ${r.musicName}>`)
                ));
            }
            const stream = new SlackChatPostMessageStream({
                token: this.configuration.global.slackApiToken,
                channel: this.configuration.global.slackChannelIdTable['noticeUpdateReportStatus'],
                text: '検証結果報告',
                blocks: blocks,
            });
            try {
                UrlFetchManager.execute([stream]);
            }
            catch (e) {
                errors.push(e);
            }
        }

        // line
        if (this.configuration.runtime.lineNoticeUnitReportEnabled) {
            const streams: LINEMessagePushStream[] = [];
            for (const r of reports) {
                // LINEグループに対しては低難易度帯の報告を投げない
                if (r.difficulty !== Difficulty.Master && (r.difficulty !== Difficulty.Expert || r.calcBaseRating() < 11)) {
                    continue;
                }
                const message: TextMessage = {
                    type: 'text',
                    text: `[単曲検証報告]
楽曲名:${r.musicName}
難易度:${Utility.toDifficultyText(r.difficulty)}
URL: ${ReportFormWebsiteController.getFullPath(this.configuration, this._pageLinkResolver, UnitReportWebsiteController, { version: versionName, reportId: r.reportId.toString() })}`
                };
                for (const target of this.configuration.global.lineNoticeTargetIdList) {
                    streams.push(new LINEMessagePushStream({
                        channelAccessToken: this.configuration.global.lineChannelAccessToken,
                        to: target,
                        messages: [message]
                    }));
                }
            }
            try {
                UrlFetchManager.execute(streams);
            }
            catch (e) {
                errors.push(e);
            }
        }

        this.noticeMissingUnitReports(missingReportIds);
        this.noticeErrors(errors);
    }
    public noticeApproveUnitReport(versionName: string, reportIds: number[]): void {
        if (reportIds.length === 0) {
            return;
        }
        const reports: IReport[] = [];
        const missingReportIds: number[] = [];
        for (const id of reportIds) {
            const r = this.reportModule.getReport(versionName, id);
            if (r) {
                reports.push(r);
            }
            else {
                missingReportIds.push(id);
            }
        }

        const errors: Error[] = [];

        // 通知処理
        // twitter
        if (this.configuration.runtime.postTweetEnabled) {
            for (const r of reports) {
                this.twitterModule.postTweet(`[譜面定数 検証結果]
楽曲名:${r.musicName}
難易度:${Utility.toDifficultyText(r.difficulty)}
譜面定数:${r.calcBaseRating().toFixed(1)}

バージョン:${this.versionModule.getVersionConfig(versionName).displayVersionName}`);
            }
        }

        // slack-結果承認
        {
            const streams: UrlFetchStream[] = [];
            // 結果承認
            {
                const blocks: Block[] = [];
                blocks.push(SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`:o: *単曲検証報告 承認(${reports.length}件)*`)
                ));
                for (const r of reports) {
                    const diffText = Utility.toDifficultyTextLowerCase(r.difficulty);
                    const url = ReportFormWebsiteController.getFullPath(this.configuration, this._pageLinkResolver, UnitReportWebsiteController, { version: versionName, reportId: r.reportId.toString() });
                    blocks.push(SlackBlockFactory.section(
                        SlackCompositionObjectFactory.markdownText(`<${url}|:chunithm_difficulty_${diffText}: ${r.musicName}>`)
                    ));
                }
                const stream = new SlackChatPostMessageStream({
                    token: this.configuration.global.slackApiToken,
                    channel: this.configuration.global.slackChannelIdTable['noticeUpdateReportStatus'],
                    text: '検証結果承認',
                    blocks: blocks,
                });
                streams.push(stream);
            }
            // 定数表更新
            {
                const blocks: Block[] = [];
                blocks.push(SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`:pushpin: *譜面定数更新(${reports.length}件)*`)
                ));
                for (const r of reports) {
                    const diffText = Utility.toDifficultyTextLowerCase(r.difficulty);
                    blocks.push(SlackBlockFactory.section(
                        SlackCompositionObjectFactory.markdownText(`:chunithm_difficulty_${diffText}: ${r.musicName}
:arrow_right: 譜面定数: ${r.calcBaseRating().toFixed(1)}`)
                    ));
                }
                const stream = new SlackChatPostMessageStream({
                    token: this.configuration.global.slackApiToken,
                    channel: this.configuration.global.slackChannelIdTable['updateMusicDataTable'],
                    text: '譜面定数更新',
                    blocks: blocks,
                });
                streams.push(stream);
            }

            try {
                UrlFetchManager.execute(streams);
            }
            catch (e) {
                errors.push(e);
            }
        }

        // line
        if (this.configuration.runtime.lineNoticeUnitReportEnabled) {
            const streams: LINEMessagePushStream[] = [];
            for (const r of reports) {
                if (r.difficulty !== Difficulty.Master && (r.difficulty !== Difficulty.Expert || r.calcBaseRating() < 11)) {
                    continue;
                }
                const message: TextMessage = {
                    type: 'text',
                    text: `⭕️[単曲検証報告 承認]⭕️
楽曲名:${r.musicName}
難易度:${Utility.toDifficultyText(r.difficulty)}
譜面定数:${r.calcBaseRating().toFixed(1)}
URL:${ReportFormWebsiteController.getFullPath(this.configuration, this._pageLinkResolver, UnitReportWebsiteController, { version: versionName, reportId: r.reportId.toString() })}`
                };
                for (const target of this.configuration.global.lineNoticeTargetIdList) {
                    streams.push(new LINEMessagePushStream({
                        channelAccessToken: this.configuration.global.lineChannelAccessToken,
                        to: target,
                        messages: [message]
                    }));
                }
            }
            try {
                UrlFetchManager.execute(streams);
            }
            catch (e) {
                errors.push(e);
            }
        }

        this.noticeMissingUnitReports(missingReportIds);
        this.noticeErrors(errors);
    }
    public noticeRejectUnitReport(versionName: string, reportIds: number[]): void {
        if (reportIds.length === 0) {
            return;
        }
        const reports: IReport[] = [];
        const missingReportIds: number[] = [];
        for (const id of reportIds) {
            const r = this.reportModule.getReport(versionName, id);
            if (r) {
                reports.push(r);
            }
            else {
                missingReportIds.push(id);
            }
        }

        const errors: Error[] = [];

        // 通知処理
        // slack
        {
            const blocks: Block[] = [];
            blocks.push(SlackBlockFactory.section(
                SlackCompositionObjectFactory.markdownText(`:x: *報告結果却下(${reports.length}件)*`)
            ));
            for (const r of reports) {
                const diffText = Utility.toDifficultyTextLowerCase(r.difficulty);
                const url = ReportFormWebsiteController.getFullPath(this.configuration, this._pageLinkResolver, UnitReportWebsiteController, { version: versionName, reportId: r.reportId.toString() })
                blocks.push(SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`<${url}|:chunithm_difficulty_${diffText}: ${r.musicName}>`)
                ));
            }
            const stream = new SlackChatPostMessageStream({
                token: this.configuration.global.slackApiToken,
                channel: this.configuration.global.slackChannelIdTable['noticeUpdateReportStatus'],
                text: '検証結果却下',
                blocks: blocks,
            });

            try {
                UrlFetchManager.execute([stream]);
            }
            catch (e) {
                errors.push(e);
            }
        }

        // line
        if (this.configuration.runtime.lineNoticeUnitReportEnabled) {
            const streams: LINEMessagePushStream[] = [];
            for (const r of reports) {
                if (r.difficulty !== Difficulty.Master && (r.difficulty !== Difficulty.Expert || r.calcBaseRating() < 11)) {
                    continue;
                }
                const message: TextMessage = {
                    type: 'text',
                    text: `✖️[検証結果 却下]✖️
楽曲名:${r.musicName}
難易度:${Utility.toDifficultyText(r.difficulty)}
URL:${ReportFormWebsiteController.getFullPath(this.configuration, this._pageLinkResolver, UnitReportWebsiteController, { version: versionName, reportId: r.reportId.toString() })}`
                };
                for (const target of this.configuration.global.lineNoticeTargetIdList) {
                    streams.push(new LINEMessagePushStream({
                        channelAccessToken: this.configuration.global.lineChannelAccessToken,
                        to: target,
                        messages: [message]
                    }));
                }
            }
            try {
                UrlFetchManager.execute(streams);
            }
            catch (e) {
                errors.push(e);
            }
        }

        this.noticeMissingUnitReports(missingReportIds);
        this.noticeErrors(errors);
    }
    private noticeMissingUnitReports(reportIds: number[]): void {
        if (!reportIds || reportIds.length === 0) {
            return
        }

        let idsText = '';
        for (const id of reportIds) {
            if (idsText) {
                idsText += ',' + id;
            }
            else {
                idsText = id.toString();
            }
        }
        const stream = new SlackChatPostMessageStream({
            token: this.configuration.global.slackApiToken,
            channel: this.configuration.global.slackChannelIdTable['alert'],
            text: 'Missing Report',
            blocks: [
                SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`:error: 単曲検証報告の取得に失敗しました\nreport id(s):[${idsText}]`)
                )
            ],
        });
        try {
            UrlFetchManager.execute([stream]);
        }
        catch (e) {
            console.error(e);
        }
    }

    public noticeCreateLevelReport(versionName: string, reportIds: number[]): void {
        if (reportIds.length === 0) {
            return;
        }
        const reports: LevelBulkReport[] = [];
        const missingReportIds: number[] = [];
        for (const id of reportIds) {
            const r = this.reportModule.getLevelBulkReportSheet(versionName).getBulkReport(id);
            if (r) {
                reports.push(r);
            }
            else {
                missingReportIds.push(id);
            }
        }

        const errors: Error[] = [];

        // 通知処理
        // slack
        {
            const blocks: Block[] = [];
            blocks.push(SlackBlockFactory.section(
                SlackCompositionObjectFactory.markdownText(`:mailbox_with_mail: *新規レベル検証報告(${reports.length}件)*`)
            ));
            for (const r of reports) {
                const difficulty = r.targetLevel >= 4 ? Difficulty.Advanced : Difficulty.Basic;
                const diffText = Utility.toDifficultyTextLowerCase(difficulty);
                const url = ReportFormWebsiteController.getFullPath(this.configuration, this._pageLinkResolver, LevelReportWebsiteController, { version: versionName, reportId: r.reportId.toString() });
                blocks.push(SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`<${url}|:chunithm_difficulty_${diffText}: Lv.${r.targetLevel} (${r.musicCount}曲)>`)
                ));
            }
            const stream = new SlackChatPostMessageStream({
                token: this.configuration.global.slackApiToken,
                channel: this.configuration.global.slackChannelIdTable['noticeUpdateReportStatus'],
                text: '検証結果報告',
                blocks: blocks,
            });
            try {
                UrlFetchManager.execute([stream]);
            }
            catch (e) {
                errors.push(e);
            }
        }

        // LINEグループに対しては低難易度帯の報告を投げない

        this.noticeMissingLevelReports(missingReportIds);
        this.noticeErrors(errors);
    }
    public noticeApproveLevelReport(versionName: string, reportIds: number[]): void {
        if (reportIds.length === 0) {
            return;
        }
        const reports: LevelBulkReport[] = [];
        const missingReportIds: number[] = [];
        for (const id of reportIds) {
            const r = this.reportModule.getLevelBulkReportSheet(versionName).getBulkReport(id);
            if (r) {
                reports.push(r);
            }
            else {
                missingReportIds.push(id);
            }
        }

        const errors: Error[] = [];

        // 通知処理
        // slack-結果承認
        {
            const streams: UrlFetchStream[] = [];
            // 結果承認
            {
                const blocks: Block[] = [];
                blocks.push(SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`:o: *レベル検証報告 承認(${reports.length}件)*`)
                ));
                for (const r of reports) {
                    const difficulty = r.targetLevel >= 4 ? Difficulty.Advanced : Difficulty.Basic;
                    const diffText = Utility.toDifficultyTextLowerCase(difficulty);
                    const url = ReportFormWebsiteController.getFullPath(this.configuration, this._pageLinkResolver, LevelReportWebsiteController, { version: versionName, reportId: r.reportId.toString() });
                    blocks.push(SlackBlockFactory.section(
                        SlackCompositionObjectFactory.markdownText(`<${url}|:chunithm_difficulty_${diffText}: Lv.${r.targetLevel} (${r.musicCount}曲)>`)
                    ));
                }
                const stream = new SlackChatPostMessageStream({
                    token: this.configuration.global.slackApiToken,
                    channel: this.configuration.global.slackChannelIdTable['noticeUpdateReportStatus'],
                    text: '検証結果承認',
                    blocks: blocks,
                });
                streams.push(stream);
            }
            // 定数表更新
            {
                const blocks: Block[] = [];
                blocks.push(SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`:pushpin: *譜面定数更新(${reports.length}件)*`)
                ));
                for (const r of reports) {
                    const difficulty = r.targetLevel >= 4 ? Difficulty.Advanced : Difficulty.Basic;
                    const diffText = Utility.toDifficultyTextLowerCase(difficulty);
                    blocks.push(SlackBlockFactory.section(
                        SlackCompositionObjectFactory.markdownText(`:chunithm_difficulty_${diffText}: Lv.${r.targetLevel} (${r.musicCount}曲)`)
                    ));
                }
                const stream = new SlackChatPostMessageStream({
                    token: this.configuration.global.slackApiToken,
                    channel: this.configuration.global.slackChannelIdTable['updateMusicDataTable'],
                    text: '譜面定数更新',
                    blocks: blocks,
                });
                streams.push(stream);
            }

            try {
                UrlFetchManager.execute(streams);
            }
            catch (e) {
                errors.push(e);
            }
        }

        // LINEグループに対しては低難易度帯の報告を投げない

        this.noticeMissingLevelReports(missingReportIds);
        this.noticeErrors(errors);
    }
    public noticeRejectLevelReport(versionName: string, reportIds: number[]): void {
        if (reportIds.length === 0) {
            return;
        }
        const reports: LevelBulkReport[] = [];
        const missingReportIds: number[] = [];
        for (const id of reportIds) {
            const r = this.reportModule.getLevelBulkReportSheet(versionName).getBulkReport(id);
            if (r) {
                reports.push(r);
            }
            else {
                missingReportIds.push(id);
            }
        }

        const errors: Error[] = [];

        // 通知処理
        // slack
        {
            const blocks: Block[] = [];
            blocks.push(SlackBlockFactory.section(
                SlackCompositionObjectFactory.markdownText(`:x: *レベル検証報告 却下(${reports.length}件)*`)
            ));
            for (const r of reports) {
                const difficulty = r.targetLevel >= 4 ? Difficulty.Advanced : Difficulty.Basic;
                const diffText = Utility.toDifficultyTextLowerCase(difficulty);
                const url = ReportFormWebsiteController.getFullPath(this.configuration, this._pageLinkResolver, LevelReportWebsiteController, { version: versionName, reportId: r.reportId.toString() });
                blocks.push(SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`<${url}|:chunithm_difficulty_${diffText}: Lv.${r.targetLevel} (${r.musicCount}曲)>`)
                ));
            }
            const stream = new SlackChatPostMessageStream({
                token: this.configuration.global.slackApiToken,
                channel: this.configuration.global.slackChannelIdTable['noticeUpdateReportStatus'],
                text: '検証結果却下',
                blocks: blocks,
            });

            try {
                UrlFetchManager.execute([stream]);
            }
            catch (e) {
                errors.push(e);
            }
        }

        // LINEグループに対しては低難易度帯の報告を投げない

        this.noticeMissingLevelReports(missingReportIds);
        this.noticeErrors(errors);
    }
    private noticeMissingLevelReports(reportIds: number[]): void {
        if (!reportIds || reportIds.length === 0) {
            return
        }

        let idsText = '';
        for (const id of reportIds) {
            if (idsText) {
                idsText += ',' + id;
            }
            else {
                idsText = id.toString();
            }
        }
        const stream = new SlackChatPostMessageStream({
            token: this.configuration.global.slackApiToken,
            channel: this.configuration.global.slackChannelIdTable['alert'],
            text: 'Missing Report',
            blocks: [
                SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`:error: レベル検証報告の取得に失敗しました\nreport id(s):[${idsText}]`)
                )
            ],
        });
        try {
            UrlFetchManager.execute([stream]);
        }
        catch (e) {
            console.error(e);
        }
    }

    private noticeErrors(errors: Error[]): void {
        if (!errors || errors.length === 0) {
            return;
        }

        const blocks: Block[] = [];
        blocks.push(SlackBlockFactory.section(
            SlackCompositionObjectFactory.markdownText(`:error: *実行時エラー(${errors.length}件)*`)
        ));
        blocks.push(SlackBlockFactory.divider());
        for (const e of errors) {
            blocks.push(SlackBlockFactory.section(
                SlackCompositionObjectFactory.markdownText(`*[Message]*\n${e.message}`)
            ));
            blocks.push(SlackBlockFactory.section(
                SlackCompositionObjectFactory.markdownText('*[StackTrace]*\n```' + e.stack + '```')
            ));
            blocks.push(SlackBlockFactory.divider());
        }
        const stream = new SlackChatPostMessageStream({
            token: this.configuration.global.slackApiToken,
            channel: this.configuration.global.slackChannelIdTable['alert'],
            text: 'Error(s) occurred',
            blocks: blocks,
        })
        try {
            UrlFetchManager.execute([stream]);
        }
        catch (e) {
            console.error(e);
        }
    }
}
