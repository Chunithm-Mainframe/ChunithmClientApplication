import { LINEPostCommandController } from "./@LINEPostCommandController";
export class PostTweetEnabledGetLINEPostCommandController extends LINEPostCommandController {
    public invoke(): void {
        const enabledText = this.module.configuration.runtime.postTweetEnabled ? "ON" : "OFF";
        this.replyMessage(this.event.replyToken, [`Twitter通知設定:${enabledText}`]);
    }
}
