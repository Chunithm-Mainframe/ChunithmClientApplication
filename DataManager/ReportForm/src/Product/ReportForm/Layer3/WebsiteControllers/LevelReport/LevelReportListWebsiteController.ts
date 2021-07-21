import { RoutingNode } from "../../../../../Packages/Router/RoutingNode";
import { Role } from "../../../Layer1/Role";
import { ReportModule } from "../../../Layer2/Modules/Report/ReportModule";
import { Difficulty } from "../../../Layer2/MusicDataTable/Difficulty";
import { LevelBulkReport } from "../../../Layer2/Report/LevelBulkReport/LevelBulkReport";
import { ReportStatus } from "../../../Layer2/Report/ReportStatus";
import { Utility } from "../../../Layer2/Utility";
import { ReportFormWebsiteController, ReportFormWebsiteParameter } from "../@ReportFormController";
import { TopWebsiteController } from "../TopWebsiteController";
import { LevelReportWebsiteController, LevelReportWebsiteParameter } from "./LevelReportWebsiteController";

export interface LevelReportListWebsiteParameter extends ReportFormWebsiteParameter {
}

export class LevelReportListWebsiteController extends ReportFormWebsiteController<LevelReportListWebsiteParameter>
{
    private get reportModule(): ReportModule { return this.getModule(ReportModule); }

    protected isAccessale(role: Role): boolean {
        return role === Role.Operator;
    }

    protected callInternal(parameter: LevelReportListWebsiteParameter, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        const listHtml = this.reportModule.getLevelBulkReports(this.targetGameVersion)
            .filter(r => r.reportStatus === ReportStatus.InProgress)
            .map(report => this.getListItemHtml(this.targetGameVersion, report))
            .reduce((acc, src) => `${acc}\n${src}`, '');

        let source = this.readHtml("Resources/Page/wip_bulk_report_list/main");
        source = this.replacePageLink(source, parameter, TopWebsiteController);
        source = source.replace(/%list%/g, listHtml);
        return this.createHtmlOutput(source);
    }

    private getListItemHtml(version: string, report: LevelBulkReport): string {
        const bg = report.targetLevel <= 3
            ? Utility.toDifficultyTextLowerCase(Difficulty.Basic)
            : Utility.toDifficultyTextLowerCase(Difficulty.Advanced);
        const date = report.reportDate;
        const dateText = LevelReportListWebsiteController.getDateText(date);
        const parameter: LevelReportWebsiteParameter = {
            version: this.targetGameVersion,
            reportId: report.reportId.toString(),
        };
        const url = this.getFullPath(parameter, LevelReportWebsiteController);
        return `<div class="music_list bg_${bg}" onclick="window.open('${encodeURI(url)}', '_top')">Lv.${report.targetLevel}/${report.musicCount}曲/${dateText}</div>`;
    }

    private static getDateText(date: Date): string {
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日(${this.getDayOfWeekText(date.getDay())})`;
    }

    private static getDayOfWeekText(day: number): string {
        switch (day) {
            case 0:
                return '日';
            case 1:
                return '月';
            case 2:
                return '火';
            case 3:
                return '水';
            case 4:
                return '木';
            case 5:
                return '金';
            case 6:
                return '土';
        }
    }
}
