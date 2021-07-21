import { RoutingNode } from "../../../../../Packages/Router/RoutingNode";
import { Role } from "../../../Layer1/Role";
import { Utility } from "../../../Layer2/Utility";
import { MusicDataModule } from "../../../Layer2/Modules/MusicDataModule";
import { ReportModule } from "../../../Layer2/Modules/Report/ReportModule";
import { MusicDataTable } from "../../../Layer2/MusicDataTable/MusicDataTable";
import { IMusicDataReport } from "../../../Layer2/Report/IMusicDataReport";
import { MusicDataReportGroup } from "../../../Layer2/Report/MusicDataReportGroup";
import { ReportStatus } from "../../../Layer2/Report/ReportStatus";
import { ReportFormWebsiteController, ReportFormWebsiteParameter } from "../@ReportFormController";
import { UnitReportGroupListWebsiteController } from "./UnitReportGroupListWebsiteController";

export interface UnitReportGroupWebsiteParameter extends ReportFormWebsiteParameter {
    groupId: string;
}

export class UnitReportGroupWebsiteController extends ReportFormWebsiteController<UnitReportGroupWebsiteParameter> {
    private readonly unkownMusicTemplate = `
<div class="result_bg bg_%difficultyLower% w420">
    不明な楽曲です。 楽曲ID: %musicId%
</div>`;

    private get musicDataModule(): MusicDataModule { return this.getModule(MusicDataModule); }
    private get reportModule(): ReportModule { return this.getModule(ReportModule); }

    protected isAccessale(role: Role): boolean {
        return role === Role.Operator;
    }

    public callInternal(parameter: UnitReportGroupWebsiteParameter, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        const table = this.musicDataModule.getTable(this.targetGameVersion);
        const reportGroup = this.reportModule
            .getMusicDataReportGroupContainer(this.targetGameVersion)
            .getMusicDataReportGroup(parameter.groupId);
        console.log(parameter.groupId);
        if (!reportGroup) {
            throw new Error("該当する検証報告グループが存在しません");
        }

        const listHtml = this.getListHtml(table, reportGroup);

        let source = this.readHtml("Resources/Page/group_approval/main");

        source = source.replace(/%versionName%/g, this.targetGameVersion);
        source = this.replacePageLink(source, parameter, UnitReportGroupWebsiteController);
        source = this.replacePageLink(source, parameter, UnitReportGroupListWebsiteController);

        source = source.replace(/%groupId%/g, parameter.groupId);
        source = source.replace(/%list%/g, listHtml);

        if (reportGroup.verified) {
            source = source.replace(/%approveFormContainer%/g, this.getResovedFormContainerHtml());
        } else {
            source = source.replace(/%approveFormContainer%/g, this.getInProgressFormContainerHtml());
        }

        return this.createHtmlOutput(source);
    }

    private getListHtml(table: MusicDataTable, reportGroup: MusicDataReportGroup): string {
        let source = '';
        for (const musicDataReport of reportGroup.getMusicDataReports()) {
            if (musicDataReport.verified) {
                continue;
            }
            source += this.getListItemHtml(table, musicDataReport) + '\n';
        }
        return source;
    }

    private getListItemHtml(table: MusicDataTable, musicDataReport: IMusicDataReport): string {
        const musicDetail = table.getMusicDataById(musicDataReport.musicId);
        const difficultyText = Utility.toDifficultyText(musicDataReport.difficulty);

        let template = '';
        if (!musicDetail) {
            template = this.unkownMusicTemplate;
            template = template.replace(/%musicId%/g, musicDataReport.musicId.toString());
            template = template.replace(/%difficultyLower%/g, difficultyText.toLowerCase());
            return template;
        }

        if (!musicDataReport.mainReport) {
            template = this.unverifiedListItemTemplate;
            template = template.replace(/%musicName%/g, musicDetail.Name);
            template = template.replace(/%difficultyLower%/g, difficultyText.toLowerCase());
            template = template.replace(/%difficulty%/g, difficultyText);
            template = template.replace(/%difficultyImagePath%/g, Utility.getDifficultyImagePath(musicDataReport.difficulty));
            return template;
        }

        const report = musicDataReport.mainReport;
        template = this.listItemTemplate;
        template = template.replace(/%musicName%/g, musicDetail.Name);
        template = template.replace(/%difficultyLower%/g, difficultyText.toLowerCase());
        template = template.replace(/%difficulty%/g, difficultyText);
        template = template.replace(/%difficultyImagePath%/g, Utility.getDifficultyImagePath(musicDataReport.difficulty));
        {
            let progress = "-";
            const status = report ? report.reportStatus : null;
            switch (status) {
                case ReportStatus.InProgress:
                    progress = `<span class="text_b" style="font-family:arial,sans-serif;">承認待ち</span>`;
                    break;
                case ReportStatus.Resolved:
                    progress = `<span class="text_b" sytle="font-family:arial,sans-serif;">承認済み</span>`;
                    break;
            }
            template = template.replace(/%progress%/g, progress);
        }

        const beforeOp = report.beforeOp;
        const afterOp = report.afterOp;
        const diffOp = Math.round((afterOp - beforeOp) * 100) / 100;
        template = template.replace(/%beforeOp%/g, beforeOp.toString());
        template = template.replace(/%afterOp%/g, afterOp.toString());
        template = template.replace(/%diffOp%/g, diffOp.toString());
        template = template.replace(/%score%/g, report.score.toString());
        template = template.replace(/%comboStatus%/g, Utility.toComboStatusText(report.comboStatus));
        template = template.replace(/%baseRating%/g, report.calcBaseRating().toFixed(1));

        const imagePaths = report.imagePaths;
        if (imagePaths.length > 0) {
            const img = imagePaths
                .map(p => `<div class="result_image"><img src="${p}" /></div>`)
                .reduce((acc, src) => acc + src);
            template = template.replace(/%verificationImageContainer%/, `<div class="result_box w400">${img}</div>`);
        }
        else {
            template = template.replace(/%verificationImageContainer%/, "");
        }

        return template;
    }

    private _listItemTemplate: string;
    private get listItemTemplate(): string {
        if (!this._listItemTemplate) {
            this._listItemTemplate = this.readHtml('Resources/Page/group_approval/list_item');
        }
        return this._listItemTemplate;
    }

    private _unverifiedListItemTemplate: string;
    private get unverifiedListItemTemplate(): string {
        if (!this._unverifiedListItemTemplate) {
            this._unverifiedListItemTemplate = this.readHtml('Resources/Page/group_approval/unverified_list_item');
        }
        return this._unverifiedListItemTemplate;
    }

    private getResovedFormContainerHtml(): string {
        return `<div style="text-align:center;">この検証報告リストは既に承認済みです</div>`;
    }

    private getInProgressFormContainerHtml(): string {
        return `
<form style="text-align:center;">
    <input type="button" value="承認" style="width: 120px; height: 30px;" onclick="confirmGroupApproval()">
</form>`;
    }
}
