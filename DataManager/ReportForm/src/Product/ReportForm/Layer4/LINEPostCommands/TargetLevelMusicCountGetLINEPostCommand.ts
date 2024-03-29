import { MusicModule } from "../../Layer3/Modules/MusicModule";
import { LINEPostCommand } from "./@LINEPostCommand";
export class TargetLevelMusicCountGetLINEPostCommand extends LINEPostCommand {
    public invoke(): void {
        const targetLevel = parseInt(this.commandText.replace('get-target-level-music-count<<', ''));
        if (targetLevel > 6) {
            this.replyMessage(this.event.replyToken, ['このコマンドはLv.6以下のみ対応しています']);
            return;
        }
        const versionName = this.module.configuration.defaultVersionName;
        const table = this.module.getModule(MusicModule).getMusicTable(versionName);
        const musicCount = table.getTargetLowLevelMusicCount(targetLevel);
        this.replyMessage(this.event.replyToken, [`対象レベル:${targetLevel}
楽曲数:${musicCount}`]);
    }
}
