import { LINEMessagePushStream } from "../../../../Packages/UrlFetch.LINE/API/Message/Push/Stream";
import { LINEMessageReplyStream } from "../../../../Packages/UrlFetch.LINE/API/Message/Reply/Stream";
import { TextMessage } from "../../../../Packages/UrlFetch.LINE/API/MessageObjects";
import { Result, UrlFetchStream } from "../../../../Packages/UrlFetch/UrlFetch";
import { UrlFetchManager } from "../../../../Packages/UrlFetch/UrlFetchManager";
import { ReportFormModule } from "./@ReportFormModule";

export class LINEModule extends ReportFormModule {
    public pushNoticeMessage(messages: string[]): Result {
        const textMessages: TextMessage[] = messages.map(m => {
            return {
                type: 'text',
                text: m,
            };
        });
        const streams: UrlFetchStream[] = [];
        for (const target of this.configuration.global.lineNoticeTargetIdList) {
            const stream = new LINEMessagePushStream({
                channelAccessToken: this.configuration.global.lineChannelAccessToken,
                to: target,
                messages: textMessages,
            });
            streams.push(stream);
        }
        return UrlFetchManager.execute(streams);
    }

    public replyMessage(replyToken: string, messages: string[]): Result {
        const textMessages: TextMessage[] = messages.map(m => {
            return {
                type: 'text',
                text: m,
            };
        });
        const stream = new LINEMessageReplyStream({
            channelAccessToken: this.configuration.global.lineChannelAccessToken,
            replyToken: replyToken,
            messages: textMessages,
        });
        return UrlFetchManager.execute(stream);
    }
}
