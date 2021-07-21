import { RoutingNode } from "../../../../../Packages/Router/RoutingNode";
import { Role } from "../../../Layer1/Role";
import { ReportModule } from "../../../Layer2/Modules/Report/ReportModule";
import { IReport } from "../../../Layer2/Report/IReport";
import { ReportStatus } from "../../../Layer2/Report/ReportStatus";
import { Utility } from "../../../Layer2/Utility";
import { ReportFormWebsiteController, ReportFormWebsiteParameter } from "../@ReportFormController";
import { TopWebsiteController } from "../TopWebsiteController";
import { UnitReportWebsiteController, UnitReportWebsiteParameter } from "./UnitReportWebsiteController";

export interface UnitReportListWebsiteParameter extends ReportFormWebsiteParameter {
}

export class UnitReportListWebsiteController extends ReportFormWebsiteController<UnitReportListWebsiteParameter> {

    private get reportModule(): ReportModule { return this.getModule(ReportModule); }

    protected isAccessale(role: Role): boolean {
        return role === Role.Operator;
    }

    protected callInternal(parameter: UnitReportListWebsiteParameter, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        const listHtml = this.reportModule.getReports(this.targetGameVersion)
            .filter(r => r.reportStatus === ReportStatus.InProgress)
            .map(r => this.getListItemHtml(this.targetGameVersion, r))
            .reduce((acc, src) => `${acc}\n${src}`, '');

        let source = this.readHtml("Resources/Page/wip_list/main");

        source = this.replacePageLink(source, parameter, TopWebsiteController);

        source = source.replace(/%list%/g, listHtml);

        return this.createHtmlOutput(source);
    }

    private getListItemHtml(version: string, report: IReport): string {
        const parameter: UnitReportWebsiteParameter = {
            version: this.targetGameVersion,
            reportId: report.reportId.toString(),
        };
        const path = this.getFullPath(parameter, UnitReportWebsiteController);
        return `<div class="music_list bg_${Utility.toDifficultyText(report.difficulty).toLowerCase()}" onclick="window.open('${path}', '_top')">${report.musicName}</div>`;
    }
}
