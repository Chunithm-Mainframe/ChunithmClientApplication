import { ReportModule } from "../../Layer3/Modules/Report/ReportModule";
import { LINEPostCommandController } from "./@LINEPostCommandController";
export class FormUrlGetLINEPostCommandController extends LINEPostCommandController {
    public invoke(): void {
        const url = this.module.getModule(ReportModule).unitReportGoogleForm.getPublishedUrl();
        this.replyMessage(this.event.replyToken, [`[検証報告フォーム]\n${url}`]);
    }
}
