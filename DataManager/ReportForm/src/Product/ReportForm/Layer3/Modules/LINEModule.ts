class LINEModule extends ReportFormModule {
    public pushNoticeMessage(messages: string[]): UrlFetchResult {
        const textMessages: UrlFetch_LINE.MessageObjects.TextMessage[] = messages.map(m => {
            return {
                type: 'text',
                text: m,
            };
        });
        const streams: UrlFetch.Stream[] = [];
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

    public replyMessage(replyToken: string, messages: string[]): UrlFetchResult {
        const textMessages: UrlFetch_LINE.MessageObjects.TextMessage[] = messages.map(m => {
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
