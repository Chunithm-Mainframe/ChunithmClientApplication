import { getAppVersion } from "../../../../@app";
import { LINEPostCommand } from "./@LINEPostCommand";
export class VersionGetLINEPostCommand extends LINEPostCommand {
    public invoke(): void {
        this.replyMessage(this.event.replyToken, [getAppVersion()]);
    }
}
