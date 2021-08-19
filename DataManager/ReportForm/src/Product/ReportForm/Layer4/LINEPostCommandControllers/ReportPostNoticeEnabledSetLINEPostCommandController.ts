import { LINEPostCommandController } from "./@LINEPostCommandController";
export class ReportPostNoticeEnabledSetLINEPostCommandController extends LINEPostCommandController {
    public invoke(): void {
        const value = this.commandText.replace("report-post-notice-enabled=", "") === "true";
        const result = value ? "ON" : "OFF";
        this.module.configuration.runtime.lineNoticeUnitReportEnabled = value;
        this.module.configuration.applyRuntimeConfiguration();
        this.replyMessage(this.event.replyToken, [`検証報告通知を${result}にしました`]);
    }
}
