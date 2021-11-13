import { DIProperty } from "../../../../Packages/DIProperty/DIProperty";
import { LINEMessagePushStream } from "../../../../Packages/UrlFetch.LINE/API/Message/Push/Stream";
import { TextMessage } from "../../../../Packages/UrlFetch.LINE/API/MessageObjects";
import { Block } from "../../../../Packages/UrlFetch.Slack/API/Blocks";
import { SlackChatPostMessageStream } from "../../../../Packages/UrlFetch.Slack/API/Chat/PostMessage/Stream";
import { SlackBlockFactory } from "../../../../Packages/UrlFetch.Slack/BlockFactory";
import { SlackCompositionObjectFactory } from "../../../../Packages/UrlFetch.Slack/CompositionObjectFactory";
import { UrlFetchStream } from "../../../../Packages/UrlFetch/UrlFetch";
import { UrlFetchManager } from "../../../../Packages/UrlFetch/UrlFetchManager";
import { ReportFormConfiguration } from "../../Layer1/Configurations/@ReportFormConfiguration";
import { Difficulty } from "../../Layer1/Difficulty";
import { Music } from "../../Layer2/Music/Music";
import { LevelReport } from "../../Layer2/Report/LevelReport/LevelReport";
import { UnitReport } from "../../Layer2/Report/UnitReport/UnitReport";
import { ReportFormPageLinkResolver } from "../../Layer2/ReportFormPageLinkResolver";
import { Utility } from "../../Layer2/Utility";
import { ReportFormModule } from "../../Layer3/Modules/@ReportFormModule";
import { MusicModule } from "../../Layer3/Modules/MusicModule";
import { ReportModule } from "../../Layer3/Modules/Report/ReportModule";
import { TwitterModule } from "../../Layer3/Modules/TwitterModule";
import { VersionModule } from "../../Layer3/Modules/VersionModule";
import { ReportFormWebsitePresenter } from "../WebsitePresenters/@ReportFormPresenter";
import { LevelReportWebsitePresenter } from "../WebsitePresenters/LevelReport/LevelReportWebsitePresenter";
import { UnitReportWebsitePresenter } from "../WebsitePresenters/UnitReport/UnitReportWebsitePresenter";

export class NoticeManager {
    @DIProperty.inject(ReportFormModule)
    private readonly _module: ReportFormModule;

    private get musicModule(): MusicModule { return this._module.getModule(MusicModule); }
    private get reportModule(): ReportModule { return this._module.getModule(ReportModule); }
    private get twitterModule(): TwitterModule { return this._module.getModule(TwitterModule); }
    private get versionModule(): VersionModule { return this._module.getModule(VersionModule); }

    private get configuration(): ReportFormConfiguration { return this._module.configuration; }

    @DIProperty.inject(ReportFormPageLinkResolver)
    private readonly _pageLinkResolver: ReportFormPageLinkResolver;

    public noticeUpdateMusic(versionName: string, targetMusics: { id: number; difficulty: Difficulty }[]) {
        if (targetMusics.length === 0) {
            return;
        }

        const musicTable = this.musicModule.getMusicTable(versionName);
        const notices: { music: Music; difficulty: Difficulty }[] = [];
        const missingMusicId: number[] = [];
        for (const t of targetMusics) {
            const m = musicTable.find({ id: t.id });
            if (m) {
                notices.push({
                    music: m,
                    difficulty: t.difficulty
                });
            }
            else {
                missingMusicId.push(t.id);
            }
        }

        const errors: Error[] = [];

        // 通知処理
        // twitter
        if (this.configuration.runtime.postTweetEnabled) {
            for (const n of notices) {
                try {
                    const message = NoticeManager.getApprovedUnitReportTwitterMessage(
                        n.music.name,
                        n.difficulty,
                        Music.getBaseRating(n.music, n.difficulty),
                        this.versionModule.getVersionConfig(versionName).displayVersionName,
                        new Date());
                    this.twitterModule.postTweet(message);
                }
                catch (e) {
                    const diffText = Utility.toDifficultyTextLowerCase(n.difficulty);
                    errors.push(e);
                    errors.push(new Error(`Twitter報告エラー: :chunithm_difficulty_${diffText}: ${n.music.name}`))
                }
            }
        }

        // slack-結果承認
        {
            const streams: UrlFetchStream[] = [];
            // 定数表更新
            {
                const blocks: Block[] = [];
                blocks.push(SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`:pushpin: *自動解析:譜面定数更新(${notices.length}件)*`)
                ));
                for (const n of notices) {
                    const diffText = Utility.toDifficultyTextLowerCase(n.difficulty);
                    blocks.push(SlackBlockFactory.section(
                        SlackCompositionObjectFactory.markdownText(`:chunithm_difficulty_${diffText}: ${n.music.name}
:arrow_right: 譜面定数: ${Music.getBaseRating(n.music, n.difficulty).toFixed(1)}`)
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
            for (const n of notices) {
                if (n.difficulty !== Difficulty.Master && (n.difficulty !== Difficulty.Expert || Music.getBaseRating(n.music, n.difficulty) < 11)) {
                    continue;
                }
                const message: TextMessage = {
                    type: 'text',
                    text: `[譜面定数 自動解析]
楽曲名:${n.music.name}
難易度:${Utility.toDifficultyText(n.difficulty)}
譜面定数:${Music.getBaseRating(n.music, n.difficulty).toFixed(1)}`
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

        this.noticeMissingMusics(missingMusicId);
        this.noticeErrors(errors);
    }

    public noticeCreateUnitReport(versionName: string, reportIds: number[]): void {
        if (reportIds.length === 0) {
            return;
        }
        const reports: UnitReport[] = [];
        const missingReportIds: number[] = [];
        for (const id of reportIds) {
            const r = this.reportModule.getUnitReport(versionName, id);
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
                const url = ReportFormWebsitePresenter.getFullPath(this.configuration, this._pageLinkResolver, UnitReportWebsitePresenter, { version: versionName, reportId: r.reportId.toString() });
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
                if (r.difficulty !== Difficulty.Master && (r.difficulty !== Difficulty.Expert || r.calculateBaseRating() < 11)) {
                    continue;
                }
                const message: TextMessage = {
                    type: 'text',
                    text: `[単曲検証報告]
楽曲名:${r.musicName}
難易度:${Utility.toDifficultyText(r.difficulty)}
URL: ${ReportFormWebsitePresenter.getFullPath(this.configuration, this._pageLinkResolver, UnitReportWebsitePresenter, { version: versionName, reportId: r.reportId.toString() })}`
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
        const reports: UnitReport[] = [];
        const missingReportIds: number[] = [];
        for (const id of reportIds) {
            const r = this.reportModule.getUnitReport(versionName, id);
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
                try {
                    const message = NoticeManager.getApprovedUnitReportTwitterMessage(
                        r.musicName,
                        r.difficulty,
                        r.calculateBaseRating(),
                        this.versionModule.getVersionConfig(versionName).displayVersionName,
                        new Date());
                    this.twitterModule.postTweet(message);
                }
                catch (e) {
                    const diffText = Utility.toDifficultyTextLowerCase(r.difficulty);
                    errors.push(e);
                    errors.push(new Error(`Twitter報告エラー: :chunithm_difficulty_${diffText}: ${r.musicName}`))
                }
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
                    const url = ReportFormWebsitePresenter.getFullPath(this.configuration, this._pageLinkResolver, UnitReportWebsitePresenter, { version: versionName, reportId: r.reportId.toString() });
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
:arrow_right: 譜面定数: ${r.calculateBaseRating().toFixed(1)}`)
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
                if (r.difficulty !== Difficulty.Master && (r.difficulty !== Difficulty.Expert || r.calculateBaseRating() < 11)) {
                    continue;
                }
                const message: TextMessage = {
                    type: 'text',
                    text: `⭕️[単曲検証報告 承認]⭕️
楽曲名:${r.musicName}
難易度:${Utility.toDifficultyText(r.difficulty)}
譜面定数:${r.calculateBaseRating().toFixed(1)}
URL:${ReportFormWebsitePresenter.getFullPath(this.configuration, this._pageLinkResolver, UnitReportWebsitePresenter, { version: versionName, reportId: r.reportId.toString() })}`
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

    public static getApprovedUnitReportTwitterMessage(musicName: string, difficulty: Difficulty, baseRating: number, displayVersionName: string, date: Date) {
        return `[譜面定数 検証結果]
楽曲名:${musicName}
難易度:${Utility.toDifficultyText(difficulty)}
譜面定数:${baseRating.toFixed(1)}

バージョン:${displayVersionName}

${date}`;
    }

    public noticeRejectUnitReport(versionName: string, reportIds: number[]): void {
        if (reportIds.length === 0) {
            return;
        }
        const reports: UnitReport[] = [];
        const missingReportIds: number[] = [];
        for (const id of reportIds) {
            const r = this.reportModule.getUnitReport(versionName, id);
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
                const url = ReportFormWebsitePresenter.getFullPath(this.configuration, this._pageLinkResolver, UnitReportWebsitePresenter, { version: versionName, reportId: r.reportId.toString() })
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
                if (r.difficulty !== Difficulty.Master && (r.difficulty !== Difficulty.Expert || r.calculateBaseRating() < 11)) {
                    continue;
                }
                const message: TextMessage = {
                    type: 'text',
                    text: `✖️[検証結果 却下]✖️
楽曲名:${r.musicName}
難易度:${Utility.toDifficultyText(r.difficulty)}
URL:${ReportFormWebsitePresenter.getFullPath(this.configuration, this._pageLinkResolver, UnitReportWebsitePresenter, { version: versionName, reportId: r.reportId.toString() })}`
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

    private noticeMissingMusics(musicIds: number[]): void {
        if (!musicIds || musicIds.length === 0) {
            return
        }

        let idsText = '';
        for (const id of musicIds) {
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
            text: 'Missing Music',
            blocks: [
                SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`:error: 楽曲の取得に失敗しました\nmusic id(s):[${idsText}]`)
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
        const reports: LevelReport[] = [];
        const missingReportIds: number[] = [];
        for (const id of reportIds) {
            const report = this.reportModule.getLevelReport(versionName, id);
            if (report) {
                reports.push(report);
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
                const difficulty = r.level >= 4 ? Difficulty.Advanced : Difficulty.Basic;
                const diffText = Utility.toDifficultyTextLowerCase(difficulty);
                const url = ReportFormWebsitePresenter.getFullPath(this.configuration, this._pageLinkResolver, LevelReportWebsitePresenter, { version: versionName, reportId: r.reportId.toString() });
                blocks.push(SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`<${url}|:chunithm_difficulty_${diffText}: Lv.${r.level} (${r.musicCount}曲)>`)
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
        const reports: LevelReport[] = [];
        const missingReportIds: number[] = [];
        for (const id of reportIds) {
            const report = this.reportModule.getLevelReport(versionName, id);
            if (report) {
                reports.push(report);
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
                    const difficulty = r.level >= 4 ? Difficulty.Advanced : Difficulty.Basic;
                    const diffText = Utility.toDifficultyTextLowerCase(difficulty);
                    const url = ReportFormWebsitePresenter.getFullPath(this.configuration, this._pageLinkResolver, LevelReportWebsitePresenter, { version: versionName, reportId: r.reportId.toString() });
                    blocks.push(SlackBlockFactory.section(
                        SlackCompositionObjectFactory.markdownText(`<${url}|:chunithm_difficulty_${diffText}: Lv.${r.level} (${r.musicCount}曲)>`)
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
                    const difficulty = r.level >= 4 ? Difficulty.Advanced : Difficulty.Basic;
                    const diffText = Utility.toDifficultyTextLowerCase(difficulty);
                    blocks.push(SlackBlockFactory.section(
                        SlackCompositionObjectFactory.markdownText(`:chunithm_difficulty_${diffText}: Lv.${r.level} (${r.musicCount}曲)`)
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
        const reports: LevelReport[] = [];
        const missingReportIds: number[] = [];
        for (const id of reportIds) {
            const report = this.reportModule.getLevelReport(versionName, id);
            if (report) {
                reports.push(report);
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
                const difficulty = r.level >= 4 ? Difficulty.Advanced : Difficulty.Basic;
                const diffText = Utility.toDifficultyTextLowerCase(difficulty);
                const url = ReportFormWebsitePresenter.getFullPath(this.configuration, this._pageLinkResolver, LevelReportWebsitePresenter, { version: versionName, reportId: r.reportId.toString() });
                blocks.push(SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`<${url}|:chunithm_difficulty_${diffText}: Lv.${r.level} (${r.musicCount}曲)>`)
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
