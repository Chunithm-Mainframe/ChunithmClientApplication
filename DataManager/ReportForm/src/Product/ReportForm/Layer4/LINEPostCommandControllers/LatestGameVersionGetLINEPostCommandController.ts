import { VersionModule } from "../../Layer3/Modules/VersionModule";
import { LINEPostCommandController } from "./@LINEPostCommandController";
export class LatestGameVersionGetLINEPostCommandController extends LINEPostCommandController {
    public invoke(): void {
        const versionConfig = this.module.getModule(VersionModule).getLatestVersionConfig();
        const message = `最新ゲームバージョン:${versionConfig.displayVersionName}`;
        this.replyMessage(this.event.replyToken, [message]);
    }
}
