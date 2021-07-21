import { RoutingNode } from "../../../../../Packages/Router/RoutingNode";
import { Role } from "../../../Layer1/Role";
import { ReportModule } from "../../../Layer2/Modules/Report/ReportModule";
import { Difficulty } from "../../../Layer2/MusicDataTable/Difficulty";
import { ReportStatus } from "../../../Layer2/Report/ReportStatus";
import { Utility } from "../../../Layer2/Utility";
import { ReportFormWebsiteController, ReportFormWebsiteParameter } from "../@ReportFormController";
import { LevelReportListWebsiteController } from "./LevelReportListWebsiteController";

export interface LevelReportWebsiteParameter extends ReportFormWebsiteParameter {
    reportId: string;
}

export class LevelReportWebsiteController extends ReportFormWebsiteController<LevelReportWebsiteParameter> {
    private get reportModule(): ReportModule { return this.getModule(ReportModule); }

    protected isAccessale(role: Role): boolean {
        return role === Role.Operator;
    }

    protected callInternal(parameter: LevelReportWebsiteParameter, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        const reportId = parseInt(parameter.reportId);
        const report = this.reportModule.getLevelBulkReportSheet(this.targetGameVersion).getBulkReport(reportId);

        if (!report) {
            throw new Error("該当する検証報告が存在しません");
        }

        let source = this.readHtml("Resources/Page/bulk_approval/main");

        source = source.replace(/%versionName%/g, this.targetGameVersion);
        source = this.replacePageLink(source, parameter, LevelReportWebsiteController);
        source = this.replacePageLink(source, parameter, LevelReportListWebsiteController);

        const difficulty = report.targetLevel <= 3 ? Difficulty.Basic : Difficulty.Advanced;

        source = source.replace(/%reportId%/g, reportId.toString());
        source = source.replace(/%targetMusicLevel%/g, report.targetLevel.toString());
        source = source.replace(/%difficulty%/g, Utility.toDifficultyTextLowerCase(difficulty));
        source = source.replace(/%difficultyImagePath%/g, Utility.getDifficultyImagePath(difficulty));
        source = source.replace(/%musicCount%/g, report.musicCount.toString());
        source = source.replace(/%op%/g, report.op.toFixed(2));
        source = source.replace(/%opRatio%/g, report.opRatio.toFixed(2));
        source = source.replace(/%reportDate%/g, this.getDateText(report.reportDate));

        const imagePaths = report.imagePaths;
        if (imagePaths.length > 0) {
            const img = imagePaths
                .map(p => `<div class="result_image"><img src="${p}" /></div>`)
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
