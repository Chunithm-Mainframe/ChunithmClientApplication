import { RoutingNode } from "../../../../../Packages/Router/RoutingNode";
import { Difficulty } from "../../../Layer1/Difficulty";
import { Role } from "../../../Layer1/Role";
import { ReportModule } from "../../../Layer3/Modules/Report/ReportModule";
import { UnitReportBundleGroup } from "../../../Layer2/Report/UnitReportGroup/UnitReportBundleGroup";
import { Utility } from "../../../Layer2/Utility";
import { ReportFormWebsitePresenter, ReportFormWebsiteParameter } from "../@ReportFormPresenter";
import { TopWebsitePresenter } from "../TopWebsitePresenter";
import { UnitReportGroupWebsitePresenter, UnitReportGroupWebsiteParameter } from "./UnitReportGroupWebsitePresenter";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UnitReportGroupListWebsiteParameter extends ReportFormWebsiteParameter {

}

export class UnitReportGroupListWebsitePresenter extends ReportFormWebsitePresenter<UnitReportGroupListWebsiteParameter> {

    private get reportModule(): ReportModule { return this.getModule(ReportModule); }

    protected isAccessale(role: Role): boolean {
        return role === Role.Operator;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected callInternal(parameter: UnitReportGroupListWebsiteParameter, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        const unitReportBundleGroups = this.reportModule.getUnitReportBundleGroups(this.targetGameVersion);
        const listHtml = this.getListHtml(unitReportBundleGroups);

        let source = this.readHtml("Resources/Page/report_group_list/main");
        source = source.replace(/%versionName%/g, this.targetGameVersion);
        source = this.replacePageLink(source, parameter, TopWebsitePresenter);
        source = source.replace(/%list%/g, listHtml);

        return this.createHtmlOutput(source);
    }

    private getListHtml(unitReportBundleGroups: UnitReportBundleGroup[]): string {
        let source = '';
        for (const group of unitReportBundleGroups) {
            source += this.getListItemHtml(group) + '\n';
        }
        return source;
    }

    private getListItemHtml(unitReportBundleGroup: UnitReportBundleGroup): string {
        let title = `ID: ${unitReportBundleGroup.groupId}`;
        let maxDiffuclty = Difficulty.Invalid;
        if (unitReportBundleGroup.unitReportBundles.every(x => x.verified)) {
            title = `<span style="color:#02d507;">[DONE]</span>` + title;
        }
        else {
            let anyWip = false;
            let allWip = true;
            for (const unitReportBundle of unitReportBundleGroup.unitReportBundles) {
                if (unitReportBundle.difficulty > maxDiffuclty) {
                    maxDiffuclty = unitReportBundle.difficulty;
                }
                if (unitReportBundle.verified) {
                    continue;
                }
                if (unitReportBundle.activeReport) {
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
            groupId: unitReportBundleGroup.groupId,
        };
        const url = this.getFullPath(parameter, UnitReportGroupWebsitePresenter);
        const template = `<div class="music_list bg_${Utility.toDifficultyTextLowerCase(maxDiffuclty)}" onclick="window.open('${encodeURI(url)}', '_top')">${title}</div>`;
        return template;
    }
}
