import { DIProperty } from "../../../../Packages/DIProperty/DIProperty";
import { ReportFormPageLinkResolver } from "../../Layer2/ReportFormPageLinkResolver";
import { ReportFormWebsitePresenter } from "../WebsitePresenters/@ReportFormPresenter";
import { TopWebsitePresenter } from "../WebsitePresenters/TopWebsitePresenter";
import { LINEPostCommand } from "./@LINEPostCommand";
export class TopUrlGetLINEPostCommand extends LINEPostCommand {
    @DIProperty.inject(ReportFormPageLinkResolver)
    private readonly _pageLinkResolver: ReportFormPageLinkResolver

    public invoke(): void {
        const version = this.module.configuration.defaultVersionName;
        const url = ReportFormWebsitePresenter.getFullPath(this.module.configuration, this._pageLinkResolver, TopWebsitePresenter, { version: version });
        this.replyMessage(this.event.replyToken, [`[検証報告管理ツール]\n${url}`]);
    }
}
