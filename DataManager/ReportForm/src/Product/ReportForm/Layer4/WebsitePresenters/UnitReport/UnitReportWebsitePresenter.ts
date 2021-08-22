import { RoutingNode } from "../../../../../Packages/Router/RoutingNode";
import { Role } from "../../../Layer1/Role";
import { Utility } from "../../../Layer2/Utility";
import { ReportModule } from "../../../Layer3/Modules/Report/ReportModule";
import { Difficulty } from "../../../Layer1/Difficulty";
import { ReportStatus } from "../../../Layer2/Report/ReportStatus";
import { ReportFormWebsitePresenter, ReportFormWebsiteParameter } from "../@ReportFormPresenter";
import { UnitReportListWebsitePresenter } from "./UnitReportListWebsitePresenter";

export interface UnitReportWebsiteParameter extends ReportFormWebsiteParameter {
    reportId: string;
}

export class UnitReportWebsitePresenter extends ReportFormWebsitePresenter<UnitReportWebsiteParameter> {
    private get reportModule(): ReportModule { return this.getModule(ReportModule); }

    protected isAccessale(role: Role): boolean {
        return role === Role.Operator;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public callInternal(parameter: UnitReportWebsiteParameter, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        const reportId = parseInt(parameter.reportId);
        const report = this.reportModule.getUnitReport(this.targetGameVersion, reportId);
        if (!report) {
            throw new Error("該当する検証報告が存在しません");
        }

        const beforeOp = report.beforeOp;
        const afterOp = report.afterOp;
        const diffOp = Math.round((afterOp - beforeOp) * 100) / 100;
        const score = report.score;
        const comboStatus = report.comboStatus;
        const baseRating = report.calculateBaseRating();

        let source = this.readHtml("Resources/Page/approval/main");

        source = source.replace(/%versionName%/g, this.targetGameVersion);
        source = this.replacePageLink(source, parameter, UnitReportWebsitePresenter);
        source = this.replacePageLink(source, parameter, UnitReportListWebsitePresenter);

        source = source.replace(/%reportId%/g, reportId.toString());
        source = source.replace(/%musicName%/g, report.musicName);
        source = source.replace(/%difficulty%/g, Utility.toDifficultyTextLowerCase(report.difficulty));
        source = source.replace(/%difficultyImagePath%/g, Utility.getDifficultyImagePath(report.difficulty));
        source = source.replace(/%beforeOp%/g, beforeOp.toString());
        source = source.replace(/%afterOp%/g, afterOp.toString());
        source = source.replace(/%diffOp%/g, diffOp.toString());
        source = source.replace(/%score%/g, score.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'));
        source = source.replace(/%comboStatus%/g, Utility.toComboStatusText(comboStatus));
        source = source.replace(/%baseRating%/g, baseRating.toFixed(1));

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
                source = source.replace(/%approveFormContainer%/g, this.getResovedFormContainerHtml(report.musicName, report.difficulty, baseRating));
                break;
            case ReportStatus.Rejected:
                source = source.replace(/%approveFormContainer%/g, this.getRejectedFormContainerHtml());
                break;
        }

        return this.createHtmlOutput(source);
    }

    private getInProgressFormContainerHtml(): string {
        const container = this.readHtml("Resources/Page/approval/wip_form_container");
        return container;
    }

    private getResovedFormContainerHtml(musicName: string, difficulty: Difficulty, baseRating: number): string {
        const container = this.readHtml("Resources/Page/approval/resoved_form_container");
        const message = `[#譜面定数 検証結果]
楽曲名: ${musicName}
難易度: ${Utility.toDifficultyText(difficulty)}
譜面定数: ${baseRating.toFixed(1)}
配信Bot->@uni_mc_bot`;
        return container.replace(/%message%/g, message);
    }

    private getRejectedFormContainerHtml(): string {
        const container = this.readHtml("Resources/Page/approval/rejected_form_container");
        return container;
    }
}
