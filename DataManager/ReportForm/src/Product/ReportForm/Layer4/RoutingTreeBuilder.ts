import { RoutingController } from "../../../Packages/Router/RoutingController";
import { RoutingParameterType } from "../../../Packages/Router/RoutingParameterType";
import { RoutingTreeEditor } from "../../../Packages/Router/RoutingTreeEditor";
import { ReportFormPageLinkResolver } from "./@ReportFormPageLinkResolver";
import { LevelReportListWebsiteController } from "./WebsiteControllers/LevelReport/LevelReportListWebsiteController";
import { LevelReportWebsiteController } from "./WebsiteControllers/LevelReport/LevelReportWebsiteController";
import { TopWebsiteController } from "./WebsiteControllers/TopWebsiteController";
import { UnitReportListWebsiteController } from "./WebsiteControllers/UnitReport/UnitReportListWebsiteController";
import { UnitReportWebsiteController } from "./WebsiteControllers/UnitReport/UnitReportWebsiteController";
import { UnitReportGroupListWebsiteController } from "./WebsiteControllers/UnitReportGroup/UnitReportGroupListWebsiteController";
import { UnitReportGroupWebsiteController } from "./WebsiteControllers/UnitReportGroup/UnitReportGroupWebsiteController";
import { UnverifiedListByGenreWebsiteController } from "./WebsiteControllers/UnverifiedList/UnverifiedListByGenreWebsiteController";
import { UnverifiedListByLevelWebsiteController } from "./WebsiteControllers/UnverifiedList/UnverifiedListByLevelWebsiteController";

export class RoutingTreeBuilder {
    public static build(editor: RoutingTreeEditor, resolver: ReportFormPageLinkResolver): void {
        const root = resolver.build(editor, TopWebsiteController, `version:${RoutingParameterType.TEXT}`);
        const shortcutRoot = editor.build("/");

        root.node.bindController(() => new TopWebsiteController());
        shortcutRoot.node.bindController(() => new TopWebsiteController());

        this.buildInternal((target, pathFormat) => resolver.build(root, target, pathFormat));
        this.buildInternal((_, pathFormat) => shortcutRoot.build(pathFormat));
    }

    private static buildInternal(nodeSelector: (target: { prototype: RoutingController; name: string }, pathFormat: string) => RoutingTreeEditor): void {
        nodeSelector(UnitReportListWebsiteController, "unitReportList").node.bindController(() => new UnitReportListWebsiteController());
        nodeSelector(UnitReportWebsiteController, `unitReport/reportId:${RoutingParameterType.TEXT}`).node.bindController(() => new UnitReportWebsiteController());

        nodeSelector(UnitReportGroupListWebsiteController, "unitReportGroupList").node.bindController(() => new UnitReportGroupListWebsiteController());
        nodeSelector(UnitReportGroupWebsiteController, `unitReportGroup/groupId:${RoutingParameterType.TEXT}`).node.bindController(() => new UnitReportGroupWebsiteController());

        nodeSelector(LevelReportListWebsiteController, "levelReportList").node.bindController(() => new LevelReportListWebsiteController());
        nodeSelector(LevelReportWebsiteController, `levelReport/reportId:${RoutingParameterType.TEXT}`).node.bindController(() => new LevelReportWebsiteController());

        nodeSelector(UnverifiedListByGenreWebsiteController, "unverifiedListByGenre").node.bindController(() => new UnverifiedListByGenreWebsiteController());
        nodeSelector(UnverifiedListByLevelWebsiteController, "unverifiedListByLevel").node.bindController(() => new UnverifiedListByLevelWebsiteController());
    }
}
