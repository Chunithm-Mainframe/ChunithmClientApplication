class ErrorWebsitePresenter extends ReportFormWebsitePresenter<ErrorWebsiteParameter>
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected callInternal(parameter: Readonly<ErrorWebsiteParameter>, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        let source = this.readHtml("Resources/Page/error/main");
        source = this.replacePageLink(source, parameter, TopWebsitePresenter);
        source = source.replace(/%message%/g, parameter.message);
        return this.createHtmlOutput(source);
    }
}
