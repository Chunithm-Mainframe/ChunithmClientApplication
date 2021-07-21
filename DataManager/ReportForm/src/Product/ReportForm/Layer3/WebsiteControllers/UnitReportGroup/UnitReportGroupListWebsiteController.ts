import { RoutingNode } from "../../../../../Packages/Router/RoutingNode";
import { Role } from "../../../Layer1/Role";
import { Utility } from "../../../Layer2/Utility";
import { ReportModule } from "../../../Layer2/Modules/Report/ReportModule";
import { Difficulty } from "../../../Layer2/MusicDataTable/Difficulty";
import { MusicDataReportGroup } from "../../../Layer2/Report/MusicDataReportGroup";
import { ReportFormWebsiteController, ReportFormWebsiteParameter } from "../@ReportFormController";
import { TopWebsiteController } from "../TopWebsiteController";
import { UnitReportGroupWebsiteController, UnitReportGroupWebsiteParameter } from "./UnitReportGroupWebsiteController";

export interface UnitReportGroupListWebsiteParameter extends ReportFormWebsiteParameter {

}

export class UnitReportGroupListWebsiteController extends ReportFormWebsiteController<UnitReportGroupListWebsiteParameter> {

    private get reportModule(): ReportModule { return this.getModule(ReportModule); }

    protected isAccessale(role: Role): boolean {
        return role === Role.Operator;
    }

    protected callInternal(parameter: UnitReportGroupListWebsiteParameter, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        const reportGroups = this.reportModule.getMusicDataReportGroupContainer(this.targetGameVersion).musicDataReportGroups;
        const listHtml = this.getListHtml(this.targetGameVersion, reportGroups);

        let source = this.readHtml("Resources/Page/report_group_list/main");
        source = source.replace(/%versionName%/g, this.targetGameVersion);
        source = this.replacePageLink(source, parameter, TopWebsiteController);
        source = source.replace(/%list%/g, listHtml);

        return this.createHtmlOutput(source);
    }

    private getListHtml(version: string, reportGroups: MusicDataReportGroup[]): string {
        let source = '';
        for (const reportGroup of reportGroups) {
            source += this.getListItemHtml(version, reportGroup) + '\n';
        }
        return source;
    }

    private getListItemHtml(version: string, reportGroup: MusicDataReportGroup): string {
        let title = `ID: ${reportGroup.groupId}`;
        let maxDiffuclty = Difficulty.Invalid;
        if (reportGroup.verified) {
            title = `<span style="color:#02d507;">[DONE]</span>` + title;
        }
        else {
            let anyWip = false;
            let allWip = true;
            for (const report of reportGroup.getMusicDataReports()) {
                if (report.difficulty > maxDiffuclty) {
                    maxDiffuclty = report.difficulty;
                }
                if (report.verified) {
                    continue;
                }
                if (report.mainReport) {
                    anyWip = true;
                }
                else {
                    allWip = false;
                }
            }
            if (allWip) {
                title = `<span style="color:#f7dd24;">[FILL]</span>` + title;
            }
            else if (anyWip) {
                title = `<span style="color:#f7dd24;">[WIP]</span>` + title;
            }
        }
        const parameter: UnitReportGroupWebsiteParameter = {
            version: this.targetGameVersion,
            groupId: reportGroup.groupId,
        };
        const url = this.getFullPath(parameter, UnitReportGroupWebsiteController);
        const template = `<div class="music_list bg_${Utility.toDifficultyTextLowerCase(maxDiffuclty)}" onclick="window.open('${encodeURI(url)}', '_top')">${title}</div>`;
        return template;
    }
}
