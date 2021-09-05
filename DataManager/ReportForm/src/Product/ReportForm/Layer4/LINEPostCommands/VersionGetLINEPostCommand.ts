import { Version } from "../../Version";
import { LINEPostCommand } from "./@LINEPostCommand";
export class VersionGetLINEPostCommand extends LINEPostCommand {
    public invoke(): void {
        this.replyMessage(this.event.replyToken, [Version.toolVersion]);
    }
}
