import { ReportModule } from "../../Layer3/Modules/Report/ReportModule";
import { LINEPostCommand } from "./@LINEPostCommand";
export class BulkReportFormBuildLINEPostCommand extends LINEPostCommand {
    public invoke(): void {
        let versionName = this.commandText.replace('build-bulk-report-form<<', '');
        if (!versionName) {
            versionName = this.module.configuration.defaultVersionName;
        }
        this.replyMessage(this.event.replyToken, [`一括報告フォームを構築します:${versionName}`]);
        this.module.getModule(ReportModule).buildLevelReportForm(versionName);
        const url = this.module.getModule(ReportModule).levelReportGoogleForm.getPublishedUrl();
        this.pushMessage([`一括報告フォームの構築が完了しました
URL: ${url}`]);
    }
}
