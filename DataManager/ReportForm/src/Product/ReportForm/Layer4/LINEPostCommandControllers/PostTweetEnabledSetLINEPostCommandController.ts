import { LINEPostCommandController } from "./@LINEPostCommandController";
export class PostTweetEnabledSetLINEPostCommandController extends LINEPostCommandController {
    public invoke(): void {
        const value = this.commandText.replace("post-tweet-enabled=", "") === "true";
        const result = value ? "ON" : "OFF";
        this.module.configuration.runtime.postTweetEnabled = value;
        this.module.configuration.applyRuntimeConfiguration();
        this.replyMessage(this.event.replyToken, [`Twitterへの通知を${result}にしました`]);
    }
}
