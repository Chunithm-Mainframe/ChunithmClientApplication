import { RoutingNode } from "../../../../Packages/Router/RoutingNode";
import { ReportFormWebsiteController, ReportFormWebsiteParameter } from "./@ReportFormController";
import { TopWebsiteController } from "./TopWebsiteController";

interface ErrorWebsiteParameter extends ReportFormWebsiteParameter {
    message: string;
}

export class ErrorWebsiteController extends ReportFormWebsiteController<ErrorWebsiteParameter>
{
    protected callInternal(parameter: Readonly<ErrorWebsiteParameter>, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        let source = this.readHtml("Resources/Page/error/main");
        source = this.replacePageLink(source, parameter, TopWebsiteController);
        source = source.replace(/%message%/g, parameter.message);
        return this.createHtmlOutput(source);
    }
}
