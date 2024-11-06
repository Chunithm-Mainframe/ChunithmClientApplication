class TestLINEPostCommand extends LINEPostCommand {
    public invoke(): void {
        const subCommand = this.commandText.replace("test-", "");
        switch (subCommand) {
            case "reply":
                this.replyMessage(this.event.replyToken, ['テスト:リプライ']);
                break;
            case "notice":
                this.pushMessage(['テスト:通知']);
                break;
            case "error-notice":
                CustomLogManager.log(LogLevel.Error, 'テスト:エラー通知');
                break;
            case "operation-notifyUnverified":
                Operations.notifyUnverified();
                this.pushMessage(['完了']);
                break;
            case "tweet":
                {
                    const date = new Date();
                    this.module.getModule(TwitterModule).postTweet(`これはテストツイートです。\n${date.toString()}`);
                }
                break;
            default:
                this.replyMessage(this.event.replyToken, [`未知のコマンドです\n${this.commandText}`]);
                break;
        }
    }
}
