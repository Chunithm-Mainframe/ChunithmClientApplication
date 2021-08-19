import { RoutingNode } from "../../../../../Packages/Router/RoutingNode";
import { Difficulty } from "../../../Layer1/Difficulty";
import { Role } from "../../../Layer1/Role";
import { ReportModule } from "../../../Layer2/Modules/Report/ReportModule";
import { MusicReportGroup } from "../../../Layer2/Report/MusicReportGroup/MusicReportGroup";
import { Utility } from "../../../Layer2/Utility";
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
        const reportGroups = this.reportModule.getMusicReportGroupTable(this.targetGameVersion).groupByGroupId();
        const listHtml = this.getListHtml(this.targetGameVersion, reportGroups);

        let source = this.readHtml("Resources/Page/report_group_list/main");
        source = source.replace(/%versionName%/g, this.targetGameVersion);
        source = this.replacePageLink(source, parameter, TopWebsiteController);
        source = source.replace(/%list%/g, listHtml);

        return this.createHtmlOutput(source);
    }

    private getListHtml(version: string, musicReportGroups: { groupId: string; records: MusicReportGroup[] }[]): string {
        let source = '';
        for (const reportGroup of musicReportGroups) {
            source += this.getListItemHtml(version, reportGroup.groupId, reportGroup.records) + '\n';
        }
        return source;
    }

    private getListItemHtml(version: string, groupId: string, musicReportGroups: MusicReportGroup[]): string {
        const unitReportGroups = musicReportGroups.map(x => this.reportModule.getUnitReportGroup(version, x.musicId, x.difficulty))
        let title = `ID: ${groupId}`;
        let maxDiffuclty = Difficulty.Invalid;
        if (unitReportGroups.every(x => x.verified)) {
            title = `<span style="color:#02d507;">[DONE]</span>` + title;
        }
        else {
            let anyWip = false;
            let allWip = true;
            for (const reportGroup of unitReportGroups) {
                if (reportGroup.difficulty > maxDiffuclty) {
                    maxDiffuclty = reportGroup.difficulty;
                }
                if (reportGroup.verified) {
                    continue;
                }
                if (reportGroup.getMainReport()) {
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
            groupId: groupId,
        };
        const url = this.getFullPath(parameter, UnitReportGroupWebsiteController);
        const template = `<div class="music_list bg_${Utility.toDifficultyTextLowerCase(maxDiffuclty)}" onclick="window.open('${encodeURI(url)}', '_top')">${title}</div>`;
        return template;
    }
}
