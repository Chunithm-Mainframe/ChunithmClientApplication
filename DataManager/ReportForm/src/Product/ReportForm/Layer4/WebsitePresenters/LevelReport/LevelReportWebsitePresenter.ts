import { RoutingNode } from "../../../../../Packages/Router/RoutingNode";
import { Role } from "../../../Layer1/Role";
import { ReportModule } from "../../../Layer3/Modules/Report/ReportModule";
import { Difficulty } from "../../../Layer1/Difficulty";
import { ReportStatus } from "../../../Layer2/Report/ReportStatus";
import { Utility } from "../../../Layer2/Utility";
import { ReportFormWebsitePresenter, ReportFormWebsiteParameter } from "../@ReportFormPresenter";
import { LevelReportListWebsitePresenter } from "./LevelReportListWebsitePresenter";

export interface LevelReportWebsiteParameter extends ReportFormWebsiteParameter {
    reportId: string;
}

export class LevelReportWebsitePresenter extends ReportFormWebsitePresenter<LevelReportWebsiteParameter> {
    private get reportModule(): ReportModule { return this.getModule(ReportModule); }

    protected isAccessale(role: Role): boolean {
        return role === Role.Operator;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected callInternal(parameter: LevelReportWebsiteParameter, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        const reportId = parseInt(parameter.reportId);
        const report = this.reportModule.getLevelReport(this.targetGameVersion, reportId);

        if (!report) {
            throw new Error("該当する検証報告が存在しません");
        }

        let source = this.readHtml("Resources/Page/bulk_approval/main");

        source = source.replace(/%versionName%/g, this.targetGameVersion);
        source = this.replacePageLink(source, parameter, LevelReportWebsitePresenter);
        source = this.replacePageLink(source, parameter, LevelReportListWebsitePresenter);

        const difficulty = report.level <= 3 ? Difficulty.Basic : Difficulty.Advanced;

        source = source.replace(/%reportId%/g, reportId.toString());
        source = source.replace(/%targetMusicLevel%/g, report.level.toString());
        source = source.replace(/%difficulty%/g, Utility.toDifficultyTextLowerCase(difficulty));
        source = source.replace(/%difficultyImagePath%/g, Utility.getDifficultyImagePath(difficulty));
        source = source.replace(/%musicCount%/g, report.musicCount.toString());
        source = source.replace(/%op%/g, report.op.toFixed(2));
        source = source.replace(/%opRatio%/g, report.opRatio.toFixed(2));
        source = source.replace(/%reportDate%/g, this.getDateText(report.createdAt));

        const imagePaths = report.imagePaths;
        if (imagePaths.length > 0) {
            const img = imagePaths
                .map(x => `<div class="result_image"><img src="${x}" /></div>`)
                .reduce((acc, src) => acc + src);
            source = source.replace(/%verificationImageContainer%/, `<div class="result_box w400">${img}</div>`);
        }
        else {
            source = source.replace(/%verificationImageContainer%/, "");
        }

        switch (report.reportStatus) {
            case ReportStatus.InProgress:
                source = source.replace(/%approveFormContainer%/g, this.getInProgressFormContainerHtml());
                break;
            case ReportStatus.Resolved:
                source = source.replace(/%approveFormContainer%/g, this.getResovedFormContainerHtml());
                break;
            case ReportStatus.Rejected:
                source = source.replace(/%approveFormContainer%/g, this.getRejectedFormContainerHtml());
                break;
        }

        return this.createHtmlOutput(source);
    }

    private getInProgressFormContainerHtml(): string {
        return this.readHtml("Resources/Page/bulk_approval/wip_form_container");
    }

    private getResovedFormContainerHtml(): string {
        return this.readHtml("Resources/Page/bulk_approval/resoved_form_container");
    }

    private getRejectedFormContainerHtml(): string {
        return this.readHtml("Resources/Page/bulk_approval/rejected_form_container");
    }

    private getDateText(date: Date): string {
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日(${this.getDayOfWeekText(date.getDay())})`;
    }

    private getDayOfWeekText(day: number): string {
        switch (day) {
            case 0:
                return '日';
            case 1:
                return '月';
            case 2:
                return '火';
            case 3:
                return '水';
            case 4:
                return '木';
            case 5:
                return '金';
            case 6:
                return '土';
        }
    }
}
