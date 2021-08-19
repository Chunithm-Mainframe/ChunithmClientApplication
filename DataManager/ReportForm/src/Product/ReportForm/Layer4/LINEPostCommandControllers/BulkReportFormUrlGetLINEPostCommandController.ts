import { ReportModule } from "../../Layer3/Modules/Report/ReportModule";
import { LINEPostCommandController } from "./@LINEPostCommandController";
export class BulkReportFormUrlGetLINEPostCommandController extends LINEPostCommandController {
    public invoke(): void {
        const url = this.module.getModule(ReportModule).levelReportGoogleForm.getPublishedUrl();
        this.replyMessage(this.event.replyToken, [`[一括検証報告フォーム]\n${url}`]);
    }
}
