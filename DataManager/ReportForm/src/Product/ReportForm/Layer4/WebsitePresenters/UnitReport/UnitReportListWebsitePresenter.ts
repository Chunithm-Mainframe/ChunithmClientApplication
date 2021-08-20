import { RoutingNode } from "../../../../../Packages/Router/RoutingNode";
import { Role } from "../../../Layer1/Role";
import { ReportModule } from "../../../Layer3/Modules/Report/ReportModule";
import { ReportStatus } from "../../../Layer2/Report/ReportStatus";
import { UnitReport } from "../../../Layer2/Report/UnitReport/UnitReport";
import { Utility } from "../../../Layer2/Utility";
import { ReportFormWebsitePresenter, ReportFormWebsiteParameter } from "../@ReportFormPresenter";
import { TopWebsitePresenter } from "../TopWebsitePresenter";
import { UnitReportWebsitePresenter, UnitReportWebsiteParameter } from "./UnitReportWebsitePresenter";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UnitReportListWebsiteParameter extends ReportFormWebsiteParameter {
}

export class UnitReportListWebsitePresenter extends ReportFormWebsitePresenter<UnitReportListWebsiteParameter> {

    private get reportModule(): ReportModule { return this.getModule(ReportModule); }

    protected isAccessale(role: Role): boolean {
        return role === Role.Operator;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected callInternal(parameter: UnitReportListWebsiteParameter, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        const listHtml = this.reportModule.getUnitReports(this.targetGameVersion)
            .filter(x => x.reportStatus === ReportStatus.InProgress)
            .map(x => this.getListItemHtml(x))
            .reduce((acc, src) => `${acc}\n${src}`, '');

        let source = this.readHtml("Resources/Page/wip_list/main");

        source = this.replacePageLink(source, parameter, TopWebsitePresenter);

        source = source.replace(/%list%/g, listHtml);

        return this.createHtmlOutput(source);
    }

    private getListItemHtml(report: UnitReport): string {
        const parameter: UnitReportWebsiteParameter = {
            version: this.targetGameVersion,
            reportId: report.reportId.toString(),
        };
        const path = this.getFullPath(parameter, UnitReportWebsitePresenter);
        return `<div class="music_list bg_${Utility.toDifficultyText(report.difficulty).toLowerCase()}" onclick="window.open('${path}', '_top')">${report.musicName}</div>`;
    }
}
