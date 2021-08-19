import { VersionModule } from "../../Layer3/Modules/VersionModule";
import { LINEPostCommandController } from "./@LINEPostCommandController";
export class DefaultGameVersionGetLINEPostCommandController extends LINEPostCommandController {
    public invoke(): void {
        const versionConfig = this.module.getModule(VersionModule).getDefaultVersionConfig();
        const message = `デフォルトゲームバージョン:${versionConfig.displayVersionName}`;
        this.replyMessage(this.event.replyToken, [message]);
    }
}
