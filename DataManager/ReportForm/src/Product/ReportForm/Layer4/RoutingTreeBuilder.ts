import { RoutingController } from "../../../Packages/Router/RoutingController";
import { RoutingParameterType } from "../../../Packages/Router/RoutingParameterType";
import { RoutingTreeEditor } from "../../../Packages/Router/RoutingTreeEditor";
import { ReportFormPageLinkResolver } from "../Layer3/@ReportFormPageLinkResolver";
import { LevelReportListWebsiteController } from "../Layer3/WebsiteControllers/LevelReport/LevelReportListWebsiteController";
import { LevelReportWebsiteController } from "../Layer3/WebsiteControllers/LevelReport/LevelReportWebsiteController";
import { TopWebsiteController } from "../Layer3/WebsiteControllers/TopWebsiteController";
import { UnitReportListWebsiteController } from "../Layer3/WebsiteControllers/UnitReport/UnitReportListWebsiteController";
import { UnitReportWebsiteController } from "../Layer3/WebsiteControllers/UnitReport/UnitReportWebsiteController";
import { UnitReportGroupListWebsiteController } from "../Layer3/WebsiteControllers/UnitReportGroup/UnitReportGroupListWebsiteController";
import { UnitReportGroupWebsiteController } from "../Layer3/WebsiteControllers/UnitReportGroup/UnitReportGroupWebsiteController";
import { UnverifiedListByGenreWebsiteController } from "../Layer3/WebsiteControllers/UnverifiedList/UnverifiedListByGenreWebsiteController";
import { UnverifiedListByLevelWebsiteController } from "../Layer3/WebsiteControllers/UnverifiedList/UnverifiedListByLevelWebsiteController";

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
