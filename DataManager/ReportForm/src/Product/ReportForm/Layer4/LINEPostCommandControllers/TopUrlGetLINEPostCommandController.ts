import { DIProperty } from "../../../../Packages/DIProperty/DIProperty";
import { Router } from "../../../../Packages/Router/Router";
import { ReportFormWebsiteController } from "../WebsiteControllers/@ReportFormController";
import { TopWebsiteController } from "../WebsiteControllers/TopWebsiteController";
import { LINEPostCommandController } from "./@LINEPostCommandController";
export class TopUrlGetLINEPostCommandController extends LINEPostCommandController {
    @DIProperty.inject(Router)
    private readonly _router: Router;
    public invoke(): void {
        const version = this.module.configuration.defaultVersionName;
        const url = ReportFormWebsiteController.getFullPath(this.module.configuration, this._router, TopWebsiteController, { version: version });
        this.replyMessage(this.event.replyToken, [`[検証報告管理ツール]\n${url}`]);
    }
}
