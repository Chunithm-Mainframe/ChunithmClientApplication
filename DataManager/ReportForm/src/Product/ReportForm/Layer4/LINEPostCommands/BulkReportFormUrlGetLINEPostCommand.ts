import { ReportModule } from "../../Layer3/Modules/Report/ReportModule";
import { LINEPostCommand } from "./@LINEPostCommand";
export class BulkReportFormUrlGetLINEPostCommand extends LINEPostCommand {
    public invoke(): void {
        const url = this.module.getModule(ReportModule).levelReportGoogleForm.getPublishedUrl();
        this.replyMessage(this.event.replyToken, [`[一括検証報告フォーム]\n${url}`]);
    }
}
