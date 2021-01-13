import { ReportModule } from "../../Layer2/Modules/Report/ReportModule";
import { LINEPostCommandController } from "./@LINEPostCommandController";
export class ReportFormBuildLINEPostCommandController extends LINEPostCommandController {
    public invoke(): void {
        let versionName = this.commandText.replace('build-report-form<<', '');
        if (!versionName) {
            versionName = this.module.configuration.defaultVersionName;
        }
        this.replyMessage(this.event.replyToken, [`報告フォームを構築します:${versionName}`]);
        this.module.getModule(ReportModule).buildForm(versionName);
        const url = this.module.getModule(ReportModule).reportGoogleForm.getPublishedUrl();
        this.pushMessage([`報告フォームの構築が完了しました
URL: ${url}`]);
    }
}
