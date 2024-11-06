class TopWebsitePresenter extends ReportFormWebsitePresenter<TopWebsiteParameter> {

    private get versionModule() { return this.getModule(VersionModule); }
    private get reportModule() { return this.getModule(ReportModule); }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected callInternal(parameter: Readonly<TopWebsiteParameter>, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        const versionText = this.versionModule.getVersionConfig(this.targetGameVersion).displayVersionName;

        let source = this.readHtml("Resources/Page/top/main");

        source = source.replace(/%version%/s, Version.toolVersion);
        source = source.replace(/%versionText%/g, versionText);

        source = this.replaceWipContainer(source, this.configuration.role);

        source = this.replacePageLink(source, parameter, UnitReportListWebsitePresenter);
        source = this.replacePageLink(source, parameter, UnitReportGroupListWebsitePresenter);
        source = this.replacePageLink(source, parameter, LevelReportListWebsitePresenter);
        source = this.replacePageLink(source, parameter, UnverifiedListByGenreWebsitePresenter);
        source = this.replacePageLink(source, parameter, UnverifiedListByLevelWebsitePresenter);

        source = source.replace(/%link:unit_report_genre_form%/g, this.reportModule.unitReportGroupByGenreGoogleForm.getPublishedUrl());
        source = source.replace(/%link:unit_report_level_form%/g, this.reportModule.unitReportGroupByLevelGoogleForm.getPublishedUrl());
        source = source.replace(/%link:level_report_form%/g, this.reportModule.levelReportGoogleForm.getPublishedUrl());

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
