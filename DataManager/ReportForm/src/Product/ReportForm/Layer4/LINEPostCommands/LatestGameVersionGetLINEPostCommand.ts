import { VersionModule } from "../../Layer3/Modules/VersionModule";
import { LINEPostCommand } from "./@LINEPostCommand";
export class LatestGameVersionGetLINEPostCommand extends LINEPostCommand {
    public invoke(): void {
        const versionConfig = this.module.getModule(VersionModule).getLatestVersionConfig();
        const message = `最新ゲームバージョン:${versionConfig.displayVersionName}`;
        this.replyMessage(this.event.replyToken, [message]);
    }
}
