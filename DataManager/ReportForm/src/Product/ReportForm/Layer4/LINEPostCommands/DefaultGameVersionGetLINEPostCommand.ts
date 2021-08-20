import { VersionModule } from "../../Layer3/Modules/VersionModule";
import { LINEPostCommand } from "./@LINEPostCommand";
export class DefaultGameVersionGetLINEPostCommand extends LINEPostCommand {
    public invoke(): void {
        const versionConfig = this.module.getModule(VersionModule).getDefaultVersionConfig();
        const message = `デフォルトゲームバージョン:${versionConfig.displayVersionName}`;
        this.replyMessage(this.event.replyToken, [message]);
    }
}
