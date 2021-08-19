import { LINEPostCommandController } from "./@LINEPostCommandController";
export class GlobalConfigValueGetLINEPostCommandController extends LINEPostCommandController {
    public invoke(): void {
        const key = this.commandText.replace('get-global-config-value<<', '');
        if (!(key in this.module.configuration.global)) {
            this.replyMessage(this.event.replyToken, [`指定のパラメータは存在しません: ${key}`]);
            return;
        }
        const value = this.module.configuration.global[key];
        this.replyMessage(this.event.replyToken, [value]);
    }
}
