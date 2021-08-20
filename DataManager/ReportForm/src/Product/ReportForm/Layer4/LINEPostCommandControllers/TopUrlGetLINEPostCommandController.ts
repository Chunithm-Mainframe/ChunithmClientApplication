import { DIProperty } from "../../../../Packages/DIProperty/DIProperty";
import { ReportFormPageLinkResolver } from "../../Layer2/ReportFormPageLinkResolver";
import { ReportFormWebsiteController } from "../WebsiteControllers/@ReportFormController";
import { TopWebsiteController } from "../WebsiteControllers/TopWebsiteController";
import { LINEPostCommandController } from "./@LINEPostCommandController";
export class TopUrlGetLINEPostCommandController extends LINEPostCommandController {
    @DIProperty.inject(ReportFormPageLinkResolver)
    private readonly _pageLinkResolver: ReportFormPageLinkResolver

    public invoke(): void {
        const version = this.module.configuration.defaultVersionName;
        const url = ReportFormWebsiteController.getFullPath(this.module.configuration, this._pageLinkResolver, TopWebsiteController, { version: version });
        this.replyMessage(this.event.replyToken, [`[検証報告管理ツール]\n${url}`]);
    }
}
