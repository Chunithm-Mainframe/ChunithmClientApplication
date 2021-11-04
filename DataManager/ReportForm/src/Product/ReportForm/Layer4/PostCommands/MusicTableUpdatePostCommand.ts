import { SlackChatPostMessageStream } from "../../../../Packages/UrlFetch.Slack/API/Chat/PostMessage/Stream";
import { SlackBlockFactory } from "../../../../Packages/UrlFetch.Slack/BlockFactory";
import { SlackCompositionObjectFactory } from "../../../../Packages/UrlFetch.Slack/CompositionObjectFactory";
import { UrlFetchManager } from "../../../../Packages/UrlFetch/UrlFetchManager";
import { LINEModule } from "../../Layer3/Modules/LINEModule";
import { MusicModule } from "../../Layer3/Modules/MusicModule";
import { ReportModule } from "../../Layer3/Modules/Report/ReportModule";
import { TwitterModule } from "../../Layer3/Modules/TwitterModule";
import { VersionModule } from "../../Layer3/Modules/VersionModule";
import { Music } from "../../Layer2/Music/Music";
import { PostCommand, PostCommandParameter } from "./@PostCommand";

interface MusicTableUpdatePostCommandParameter extends PostCommandParameter {
    musics: Required<Music>[];
}

export class MusicTableUpdatePostCommand extends PostCommand {
    private get versionModule(): VersionModule { return this.module.getModule(VersionModule); }
    private get musicModule(): MusicModule { return this.module.getModule(MusicModule); }
    private get reportModule(): ReportModule { return this.module.getModule(ReportModule); }
    private get lineModule(): LINEModule { return this.module.getModule(LINEModule); }
    private get twitterModule(): TwitterModule { return this.module.getModule(TwitterModule); }

    public invoke(postData: MusicTableUpdatePostCommandParameter) {
        const currentTable = this.musicModule.getMusicTable(postData.versionName);
        const isNewlyCreatedTable = currentTable.records.length === 0;

        const table = this.musicModule.getMusicTable(postData.versionName);
        const result = this.musicModule.updateMusicTable(table, postData.musics);

        if (result.added.length > 0) {
            const genres = this.versionModule.getVersionConfig(postData.versionName).genres;

            this.reportModule.updateMusicsUnitReportForm(postData.versionName);

            if (isNewlyCreatedTable) {
                this.notifyRepositoryInitialization(genres, currentTable.records);
            }
            else {
                this.notifyRepositoryUpdate(result.added);
            }
        }

        return result;
    }

    private notifyRepositoryInitialization(genres: string[], musics: Music[]): void {
        const musicCountMap = this.getMusicCountMap(genres, musics);

        const message = this.getNotificationMessageOfRepositoryInitialization(musicCountMap);
        this.lineModule.pushNoticeMessage([message]);
        this.twitterModule.postTweet(message);

        const slackMessage = this.getNotificationSlackMessageOfRepositoryInitialization(musicCountMap);
        UrlFetchManager.execute([
            new SlackChatPostMessageStream({
                token: this.module.configuration.global.slackApiToken,
                channel: this.module.configuration.global.slackChannelIdTable['updateMusicDataTable'],
                text: `新規定数表作成`,
                blocks: [
                    SlackBlockFactory.section(
                        SlackCompositionObjectFactory.markdownText(
                            slackMessage
                        )
                    )
                ]
            })
        ]);
    }

    private getMusicCountMap(genres: string[], musics: Music[]) {
        const musicCountByGenre: Record<string, number> = {};
        for (const genre of genres) {
            musicCountByGenre[genre] = musics.filter(x => x.genre === genre).length;
        }
        return musicCountByGenre;
    }

    private getNotificationMessageOfRepositoryInitialization(musicCountMap: Record<string, number>): string {
        let message = '[新規定数表作成]\n';
        for (const genre of Object.keys(musicCountMap)) {
            message += `${genre}: ${musicCountMap[genre]}\n`;
        }
        return message;
    }

    private getNotificationSlackMessageOfRepositoryInitialization(musicCountMap: Record<string, number>): string {
        let message = ':musical_keyboard: *新規定数表作成*';
        for (const genre of Object.keys(musicCountMap)) {
            message += `
${genre}: ${musicCountMap[genre]}曲`;
        }
        return message;
    }

    private notifyRepositoryUpdate(added: Music[]): void {
        const message = this.getNotificationMessageOfRepositoryUpdate(added);
        this.lineModule.pushNoticeMessage([message]);
        this.twitterModule.postTweet(message);

        const slackMessage = this.getNotificationSlackMessageOfRepositoryUpdate(added);
        UrlFetchManager.execute([
            new SlackChatPostMessageStream({
                token: this.module.configuration.global.slackApiToken,
                channel: this.module.configuration.global.slackChannelIdTable['updateMusicDataTable'],
                text: `新曲追加(${added.length}曲)`,
                blocks: [
                    SlackBlockFactory.section(
                        SlackCompositionObjectFactory.markdownText(
                            slackMessage
                        )
                    )
                ]
            })
        ]);
    }

    private getNotificationMessageOfRepositoryUpdate(added: Music[]): string {
        let message = "[新曲追加]";
        for (let i = 0; i < added.length; i++) {
            const m = added[i];
            const basicLevelText = m.basicBaseRating.toString().replace(".5", "+");
            const advancedLevelText = m.advancedBaseRating.toString().replace(".5", "+");
            const expertLevelText = m.expertBaseRating.toString().replace(".5", "+");
            const masterLevelText = m.masterBaseRating.toString().replace(".5", "+");
            message += `
${m.name} ${basicLevelText}/${advancedLevelText}/${expertLevelText}/${masterLevelText}`;
        }
        return message;
    }

    private getNotificationSlackMessageOfRepositoryUpdate(added: Music[]): string {
        let message = `:musical_keyboard: *新曲追加* (${added.length}曲)`;
        for (let i = 0; i < added.length; i++) {
            const m = added[i];
            const basicLevelText = m.basicBaseRating.toString().replace(".5", "+");
            const advancedLevelText = m.advancedBaseRating.toString().replace(".5", "+");
            const expertLevelText = m.expertBaseRating.toString().replace(".5", "+");
            const masterLevelText = m.masterBaseRating.toString().replace(".5", "+");
            message += `
${i + 1}. ${m.name} ${basicLevelText}/${advancedLevelText}/${expertLevelText}/${masterLevelText}`;
        }
        return message;
    }
}
