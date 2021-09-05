import { RoutingNode } from "../../../../Packages/Router/RoutingNode";
import { Version } from "../../Version";
import { Role } from "../../Layer1/Role";
import { ReportModule } from "../../Layer3/Modules/Report/ReportModule";
import { VersionModule } from "../../Layer3/Modules/VersionModule";
import { ReportFormWebsiteParameter, ReportFormWebsitePresenter } from "./@ReportFormPresenter";
import { LevelReportListWebsitePresenter } from "./LevelReport/LevelReportListWebsitePresenter";
import { UnitReportListWebsitePresenter } from "./UnitReport/UnitReportListWebsitePresenter";
import { UnitReportGroupListWebsitePresenter } from "./UnitReportGroup/UnitReportGroupListWebsitePresenter";
import { UnverifiedListByGenreWebsitePresenter } from "./UnverifiedList/UnverifiedListByGenreWebsitePresenter";
import { UnverifiedListByLevelWebsitePresenter } from "./UnverifiedList/UnverifiedListByLevelWebsitePresenter";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TopWebsiteParameter extends ReportFormWebsiteParameter {
}

export class TopWebsitePresenter extends ReportFormWebsitePresenter<TopWebsiteParameter> {

    private get versionModule() { return this.getModule(VersionModule); }
    private get reportModule() { return this.getModule(ReportModule); }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected callInternal(parameter: Readonly<TopWebsiteParameter>, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        const versionText = this.versionModule.getVersionConfig(this.targetGameVersion).displayVersionName;

        let source = this.readHtml("Resources/Page/top/main");

        source = source.replace(/%version%/s, Version.toolVersion);
        source = source.replace(/%versionText%/g, versionText);

        source = this.replaceWipContainer(source, this.configuration.role);

        source = this.replacePageLink(source, parameter, UnitReportListWebsitePresenter);
        source = this.replacePageLink(source, parameter, UnitReportGroupListWebsitePresenter);
        source = this.replacePageLink(source, parameter, LevelReportListWebsitePresenter);
        source = this.replacePageLink(source, parameter, UnverifiedListByGenreWebsitePresenter);
        source = this.replacePageLink(source, parameter, UnverifiedListByLevelWebsitePresenter);

        source = source.replace(/%link:unit_report_genre_form%/g, this.reportModule.unitReportGroupByGenreGoogleForm.getPublishedUrl());
        source = source.replace(/%link:unit_report_level_form%/g, this.reportModule.unitReportGroupByLevelGoogleForm.getPublishedUrl());
        source = source.replace(/%link:level_report_form%/g, this.reportModule.levelReportGoogleForm.getPublishedUrl());

        return this.createHtmlOutput(source);
    }

    private replaceWipContainer(source: string, role: Role): string {
        if (role === Role.Operator) {
            const container = this.readHtml("Resources/Page/top/wip_list_container");
            source = source.replace(/%wip_list_container%/g, container);
        }
        else {
            source = source.replace(/%wip_list_container%/g, "");
        }
        return source;
    }
}
