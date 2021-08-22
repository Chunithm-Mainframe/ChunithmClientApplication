import { LINEPostCommand } from "./@LINEPostCommand";
export class PostTweetEnabledGetLINEPostCommand extends LINEPostCommand {
    public invoke(): void {
        const enabledText = this.module.configuration.runtime.postTweetEnabled ? "ON" : "OFF";
        this.replyMessage(this.event.replyToken, [`Twitter通知設定:${enabledText}`]);
    }
}
