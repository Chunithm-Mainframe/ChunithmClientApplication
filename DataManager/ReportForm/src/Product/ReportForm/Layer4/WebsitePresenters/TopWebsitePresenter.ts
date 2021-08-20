import { getAppVersion } from "../../../../@app";
import { RoutingNode } from "../../../../Packages/Router/RoutingNode";
import { Role } from "../../Layer1/Role";
import { VersionModule } from "../../Layer3/Modules/VersionModule";
import { ReportFormWebsitePresenter, ReportFormWebsiteParameter } from "./@ReportFormPresenter";
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected callInternal(parameter: Readonly<TopWebsiteParameter>, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        const versionText = this.versionModule.getVersionConfig(this.targetGameVersion).displayVersionName;

        let source = this.readHtml("Resources/Page/top/main");

        source = source.replace(/%version%/s, getAppVersion());
        source = source.replace(/%versionText%/g, versionText);

        source = this.replaceWipContainer(source, this.configuration.role);

        source = this.replacePageLink(source, parameter, UnitReportListWebsitePresenter);
        source = this.replacePageLink(source, parameter, UnitReportGroupListWebsitePresenter);
        source = this.replacePageLink(source, parameter, LevelReportListWebsitePresenter);
        source = this.replacePageLink(source, parameter, UnverifiedListByGenreWebsitePresenter);
        source = this.replacePageLink(source, parameter, UnverifiedListByLevelWebsitePresenter);

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
