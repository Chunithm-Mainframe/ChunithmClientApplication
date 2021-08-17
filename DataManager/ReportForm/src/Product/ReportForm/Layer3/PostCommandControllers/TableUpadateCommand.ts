import { SlackChatPostMessageStream } from "../../../../Packages/UrlFetch.Slack/API/Chat/PostMessage/Stream";
import { SlackBlockFactory } from "../../../../Packages/UrlFetch.Slack/BlockFactory";
import { SlackCompositionObjectFactory } from "../../../../Packages/UrlFetch.Slack/CompositionObjectFactory";
import { UrlFetchManager } from "../../../../Packages/UrlFetch/UrlFetchManager";
import { WebhookEventName } from "../../Dependencies/WebhookEventDefinition";
import { LINEModule } from "../../Layer2/Modules/LINEModule";
import { MusicDataModule } from "../../Layer2/Modules/MusicDataModule";
import { ReportModule } from "../../Layer2/Modules/Report/ReportModule";
import { TwitterModule } from "../../Layer2/Modules/TwitterModule";
import { VersionModule } from "../../Layer2/Modules/VersionModule";
import { WebhookModule } from "../../Layer2/Modules/WebhookModule";
import { MusicData, MusicDataParameter } from "../../Layer2/MusicDataTable/MusicData";
import { PostCommand, PostCommandParameter } from "./@PostCommand";

interface TableUpdateCommandParameter extends PostCommandParameter {
    MusicDatas: MusicDataParameter[];
}

export class TableUpdateCommand extends PostCommand {
    private get musicDataModule(): MusicDataModule { return this.module.getModule(MusicDataModule); }
    private get lineModule(): LINEModule { return this.module.getModule(LINEModule); }
    private get twitterModule(): TwitterModule { return this.module.getModule(TwitterModule); }
    private get reportModule(): ReportModule { return this.module.getModule(ReportModule); }
    private get versionModule(): VersionModule { return this.module.getModule(VersionModule); }
    private get webhookModule(): WebhookModule { return this.module.getModule(WebhookModule); }

    public invoke(postData: TableUpdateCommandParameter): any {
        const oldMusicDatas = this.musicDataModule.getTable(postData.versionName).datas;
        const musicDataTable = this.musicDataModule.updateTable(postData.versionName, postData.MusicDatas);
        const response = {
            MusicDataTable: {
                MusicDatas: musicDataTable.getTable(),
            }
        }

        const addedMusicDatas = this.getAddedMusicDatas(oldMusicDatas, musicDataTable.getTable());

        if (addedMusicDatas.length > 0) {
            const musicCounts = this.setMusicList(postData.versionName, musicDataTable.datas);
            if (oldMusicDatas.length > 0) {
                let message = "[新曲追加]";
                for (let i = 0; i < addedMusicDatas.length; i++) {
                    const m = addedMusicDatas[i];
                    const basicLevelText = m.BasicLevel.toString().replace(".7", "+");
                    const advancedLevelText = m.AdvancedLevel.toString().replace(".7", "+");
                    const expertLevelText = m.ExpertLevel.toString().replace(".7", "+");
                    const masterLevelText = m.MasterLevel.toString().replace(".7", "+");
                    message += `
${m.Name} ${basicLevelText}/${advancedLevelText}/${expertLevelText}/${masterLevelText}`;
                }
                this.lineModule.pushNoticeMessage([message]);
                this.twitterModule.postTweet(message);

                let slackMessage = `:musical_keyboard: *新曲追加* (${addedMusicDatas.length}曲)`;
                for (let i = 0; i < addedMusicDatas.length; i++) {
                    const m = addedMusicDatas[i];
                    const basicLevelText = m.BasicLevel.toString().replace(".7", "+");
                    const advancedLevelText = m.AdvancedLevel.toString().replace(".7", "+");
                    const expertLevelText = m.ExpertLevel.toString().replace(".7", "+");
                    const masterLevelText = m.MasterLevel.toString().replace(".7", "+");
                    slackMessage += `
${i + 1}. ${m.Name} ${basicLevelText}/${advancedLevelText}/${expertLevelText}/${masterLevelText}`;
                }
                UrlFetchManager.execute([
                    new SlackChatPostMessageStream({
                        token: this.module.configuration.global.slackApiToken,
                        channel: this.module.configuration.global.slackChannelIdTable['updateMusicDataTable'],
                        text: `新曲追加(${addedMusicDatas.length}曲)`,
                        blocks: [
                            SlackBlockFactory.section(
                                SlackCompositionObjectFactory.markdownText(
                                    slackMessage
                                )
                            )
                        ]
                    })
                ]);

                this.webhookModule.invoke(WebhookEventName.ON_UPDATE_TABLE);
            }
            else {
                let message = '[新規定数表作成]\n';
                for (const genre in musicCounts) {
                    message += `${genre}: ${musicCounts[genre]}\n`;
                }
                this.lineModule.pushNoticeMessage([message]);
                this.twitterModule.postTweet(message);

                let slackMessage = ':musical_keyboard: *新規定数表作成*';
                for (const genre in musicCounts) {
                    slackMessage += `
${genre}: ${musicCounts[genre]}曲`;
                }
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

                this.webhookModule.invoke(WebhookEventName.ON_UPDATE_TABLE);
            }
        }

        return response;
    }

    private getAddedMusicDatas(oldMusicDatas: MusicData[], newMusicDatas: MusicData[]): MusicData[] {
        const oldMusicIds: { [key: string]: boolean } = {};
        for (const md of oldMusicDatas) {
            oldMusicIds[md.Id.toString()] = true;
        }

        const added: MusicData[] = [];
        for (const md of newMusicDatas) {
            if (!oldMusicIds[md.Id.toString()]) {
                added.push(md);
            }
        }
        return added;
    }

    private setMusicList(versionName: string, musicDatas: MusicData[]): { [genre: string]: number } {
        const form = this.reportModule.reportGoogleForm;
        const list = form.getItems(FormApp.ItemType.LIST);

        const genres = this.versionModule.getVersionConfig(versionName).genres;
        genres.push("ALL");
        const musicCounts: { [genre: string]: number } = {};
        for (let i = 0; i < genres.length; i++) {
            const genre = genres[i];
            const musicList = list[i + 1].asListItem();
            const filteredMusicDatas = musicDatas.filter(function (m) { return genre === "ALL" ? true : m.Genre === genre; });
            if (filteredMusicDatas.length > 0) {
                musicList.setChoiceValues(filteredMusicDatas.map(function (m) { return m.Name; }));
            }
            else {
                musicList.setChoiceValues([""]);
            }
            musicCounts[genre] = filteredMusicDatas.length;
        }
        return musicCounts;
    }
}
