class UnitReportListWebsitePresenter extends ReportFormWebsitePresenter<UnitReportListWebsiteParameter> {

    private get reportModule(): ReportModule { return this.getModule(ReportModule); }

    protected isAccessale(role: Role): boolean {
        return role === Role.Operator;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected callInternal(parameter: UnitReportListWebsiteParameter, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        const listHtml = this.reportModule.getUnitReports(this.targetGameVersion)
            .filter(x => x.reportStatus === ReportStatus.InProgress)
            .map(x => this.getListItemHtml(x))
            .reduce((acc, src) => `${acc}\n${src}`, '');

        let source = this.readHtml("Resources/Page/wip_list/main");

        source = this.replacePageLink(source, parameter, TopWebsitePresenter);

        source = source.replace(/%list%/g, listHtml);

        return this.createHtmlOutput(source);
    }

    private getListItemHtml(report: UnitReport): string {
        const parameter: UnitReportWebsiteParameter = {
            version: this.targetGameVersion,
            reportId: report.reportId.toString(),
        };
        const path = this.getFullPath(parameter, UnitReportWebsitePresenter);
        return `<div class="music_list bg_${Utility.toDifficultyText(report.difficulty).toLowerCase()}" onclick="window.open('${path}', '_top')">${report.musicName}</div>`;
    }
}
