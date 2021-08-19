import { LINEPostCommandController } from "./@LINEPostCommandController";
export class ReportPostNoticeEnabledGetLINEPostCommandController extends LINEPostCommandController {
    public invoke(): void {
        const enabledText = this.module.configuration.runtime.lineNoticeUnitReportEnabled ? "ON" : "OFF";
        this.replyMessage(this.event.replyToken, [`検証報告通知設定:${enabledText}`]);
    }
}
