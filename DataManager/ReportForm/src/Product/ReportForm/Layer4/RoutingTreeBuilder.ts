import { RoutingController } from "../../../Packages/Router/RoutingController";
import { RoutingParameterType } from "../../../Packages/Router/RoutingParameterType";
import { RoutingTreeEditor } from "../../../Packages/Router/RoutingTreeEditor";
import { ReportFormPageLinkResolver } from "../Layer2/ReportFormPageLinkResolver";
import { LevelReportListWebsitePresenter } from "./WebsitePresenters/LevelReport/LevelReportListWebsitePresenter";
import { LevelReportWebsitePresenter } from "./WebsitePresenters/LevelReport/LevelReportWebsitePresenter";
import { TopWebsitePresenter } from "./WebsitePresenters/TopWebsitePresenter";
import { UnitReportListWebsitePresenter } from "./WebsitePresenters/UnitReport/UnitReportListWebsitePresenter";
import { UnitReportWebsitePresenter } from "./WebsitePresenters/UnitReport/UnitReportWebsitePresenter";
import { UnitReportGroupListWebsitePresenter } from "./WebsitePresenters/UnitReportGroup/UnitReportGroupListWebsitePresenter";
import { UnitReportGroupWebsitePresenter } from "./WebsitePresenters/UnitReportGroup/UnitReportGroupWebsitePresenter";
import { UnverifiedListByGenreWebsitePresenter } from "./WebsitePresenters/UnverifiedList/UnverifiedListByGenreWebsitePresenter";
import { UnverifiedListByLevelWebsitePresenter } from "./WebsitePresenters/UnverifiedList/UnverifiedListByLevelWebsitePresenter";

export class RoutingTreeBuilder {
    public static build(editor: RoutingTreeEditor, resolver: ReportFormPageLinkResolver): void {
        const root = resolver.build(editor, TopWebsitePresenter, `version:${RoutingParameterType.TEXT}`);
        const shortcutRoot = editor.build("/");

        root.node.bindController(() => new TopWebsitePresenter());
        shortcutRoot.node.bindController(() => new TopWebsitePresenter());

        this.buildInternal((target, pathFormat) => resolver.build(root, target, pathFormat));
        this.buildInternal((_, pathFormat) => shortcutRoot.build(pathFormat));
    }

    private static buildInternal(nodeSelector: (target: { prototype: RoutingController; name: string }, pathFormat: string) => RoutingTreeEditor): void {
        nodeSelector(UnitReportListWebsitePresenter, "unitReportList").node.bindController(() => new UnitReportListWebsitePresenter());
        nodeSelector(UnitReportWebsitePresenter, `unitReport/reportId:${RoutingParameterType.TEXT}`).node.bindController(() => new UnitReportWebsitePresenter());

        nodeSelector(UnitReportGroupListWebsitePresenter, "unitReportGroupList").node.bindController(() => new UnitReportGroupListWebsitePresenter());
        nodeSelector(UnitReportGroupWebsitePresenter, `unitReportGroup/groupId:${RoutingParameterType.TEXT}`).node.bindController(() => new UnitReportGroupWebsitePresenter());

        nodeSelector(LevelReportListWebsitePresenter, "levelReportList").node.bindController(() => new LevelReportListWebsitePresenter());
        nodeSelector(LevelReportWebsitePresenter, `levelReport/reportId:${RoutingParameterType.TEXT}`).node.bindController(() => new LevelReportWebsitePresenter());

        nodeSelector(UnverifiedListByGenreWebsitePresenter, "unverifiedListByGenre").node.bindController(() => new UnverifiedListByGenreWebsitePresenter());
        nodeSelector(UnverifiedListByLevelWebsitePresenter, "unverifiedListByLevel").node.bindController(() => new UnverifiedListByLevelWebsitePresenter());
    }
}
