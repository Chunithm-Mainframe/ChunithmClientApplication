import { getAppVersion } from "../../../../@app";
import { LINEPostCommandController } from "./@LINEPostCommandController";
export class VersionGetLINEPostCommandController extends LINEPostCommandController {
    public invoke(): void {
        this.replyMessage(this.event.replyToken, [getAppVersion()]);
    }
}
