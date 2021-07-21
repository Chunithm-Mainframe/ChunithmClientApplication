import { getAppVersion } from "../../../../@app";
import { RoutingNode } from "../../../../Packages/Router/RoutingNode";
import { Role } from "../../Layer1/Role";
import { VersionModule } from "../../Layer2/Modules/VersionModule";
import { ReportFormWebsiteController, ReportFormWebsiteParameter } from "./@ReportFormController";
import { LevelReportListWebsiteController } from "./LevelReport/LevelReportListWebsiteController";
import { UnitReportListWebsiteController } from "./UnitReport/UnitReportListWebsiteController";
import { UnitReportGroupListWebsiteController } from "./UnitReportGroup/UnitReportGroupListWebsiteController";
import { UnverifiedListByGenreWebsiteController } from "./UnverifiedList/UnverifiedListByGenreWebsiteController";
import { UnverifiedListByLevelWebsiteController } from "./UnverifiedList/UnverifiedListByLevelWebsiteController";

export interface TopWebsiteParameter extends ReportFormWebsiteParameter {
}

export class TopWebsiteController extends ReportFormWebsiteController<TopWebsiteParameter> {

    private get versionModule() { return this.getModule(VersionModule); }

    protected callInternal(parameter: Readonly<TopWebsiteParameter>, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        const versionText = this.versionModule.getVersionConfig(this.targetGameVersion).displayVersionName;

        let source = this.readHtml("Resources/Page/top/main");

        source = source.replace(/%version%/s, getAppVersion());
        source = source.replace(/%versionText%/g, versionText);

        source = this.replaceWipContainer(source, this.configuration.role);

        source = this.replacePageLink(source, parameter, UnitReportListWebsiteController);
        source = this.replacePageLink(source, parameter, UnitReportGroupListWebsiteController);
        source = this.replacePageLink(source, parameter, LevelReportListWebsiteController);
        source = this.replacePageLink(source, parameter, UnverifiedListByGenreWebsiteController);
        source = this.replacePageLink(source, parameter, UnverifiedListByLevelWebsiteController);

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
