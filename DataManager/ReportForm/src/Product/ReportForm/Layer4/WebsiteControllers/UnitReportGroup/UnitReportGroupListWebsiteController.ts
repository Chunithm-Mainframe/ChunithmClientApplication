import { RoutingNode } from "../../../../../Packages/Router/RoutingNode";
import { Difficulty } from "../../../Layer1/Difficulty";
import { Role } from "../../../Layer1/Role";
import { ReportModule } from "../../../Layer3/Modules/Report/ReportModule";
import { UnitReportBundleGroup } from "../../../Layer2/Report/UnitReportGroup/UnitReportBundleGroup";
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
        const unitReportBundleGroups = this.reportModule.getUnitReportBundleGroups(this.targetGameVersion);
        const listHtml = this.getListHtml(unitReportBundleGroups);

        let source = this.readHtml("Resources/Page/report_group_list/main");
        source = source.replace(/%versionName%/g, this.targetGameVersion);
        source = this.replacePageLink(source, parameter, TopWebsiteController);
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
        const url = this.getFullPath(parameter, UnitReportGroupWebsiteController);
        const template = `<div class="music_list bg_${Utility.toDifficultyTextLowerCase(maxDiffuclty)}" onclick="window.open('${encodeURI(url)}', '_top')">${title}</div>`;
        return template;
    }
}
