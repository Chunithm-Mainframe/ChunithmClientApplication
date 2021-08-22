import { ReportModule } from "../../Layer3/Modules/Report/ReportModule";
import { LINEPostCommand } from "./@LINEPostCommand";
export class ReportFormBuildLINEPostCommand extends LINEPostCommand {
    public invoke(): void {
        let versionName = this.commandText.replace('build-report-form<<', '');
        if (!versionName) {
            versionName = this.module.configuration.defaultVersionName;
        }
        this.replyMessage(this.event.replyToken, [`報告フォームを構築します:${versionName}`]);
        this.module.getModule(ReportModule).buildUnitReportGroupByGenreForm(versionName);
        const url = this.module.getModule(ReportModule).unitReportGroupByGenreGoogleForm.getPublishedUrl();
        this.pushMessage([`報告フォームの構築が完了しました
URL: ${url}`]);
    }
}
