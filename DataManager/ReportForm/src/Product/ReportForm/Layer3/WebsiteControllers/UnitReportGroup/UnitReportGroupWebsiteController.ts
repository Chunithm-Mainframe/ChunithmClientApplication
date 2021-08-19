import { RoutingNode } from "../../../../../Packages/Router/RoutingNode";
import { Role } from "../../../Layer1/Role";
import { MusicModule } from "../../../Layer2/Modules/MusicModule";
import { ReportModule } from "../../../Layer2/Modules/Report/ReportModule";
import { MusicTable } from "../../../Layer2/Music/MusicTable";
import { ReportStatus } from "../../../Layer2/Report/ReportStatus";
import { UnitReportGroup } from "../../../Layer2/Report/UnitReportGroup/UnitReportGroup";
import { Utility } from "../../../Layer2/Utility";
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

    private get musicModule(): MusicModule { return this.getModule(MusicModule); }
    private get reportModule(): ReportModule { return this.getModule(ReportModule); }

    protected isAccessale(role: Role): boolean {
        return role === Role.Operator;
    }

    public callInternal(parameter: UnitReportGroupWebsiteParameter, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        const musicTable = this.musicModule.getMusicTable(this.targetGameVersion);
        const reportGroups = this.reportModule.getUnitReportGroups(this.targetGameVersion, parameter.groupId);

        console.log(parameter.groupId);
        if (!reportGroups) {
            throw new Error("該当する検証報告グループが存在しません");
        }

        const listHtml = this.getListHtml(musicTable, reportGroups);

        let source = this.readHtml("Resources/Page/group_approval/main");

        source = source.replace(/%versionName%/g, this.targetGameVersion);
        source = this.replacePageLink(source, parameter, UnitReportGroupWebsiteController);
        source = this.replacePageLink(source, parameter, UnitReportGroupListWebsiteController);

        source = source.replace(/%groupId%/g, parameter.groupId);
        source = source.replace(/%list%/g, listHtml);

        if (reportGroups.every(x => x.verified)) {
            source = source.replace(/%approveFormContainer%/g, this.getResovedFormContainerHtml());
        } else {
            source = source.replace(/%approveFormContainer%/g, this.getInProgressFormContainerHtml());
        }

        return this.createHtmlOutput(source);
    }

    private getListHtml(repository: MusicTable, unitReportGroups: UnitReportGroup[]): string {
        let source = '';
        for (const reportGroup of unitReportGroups) {
            if (reportGroup.verified) {
                continue;
            }
            source += this.getListItemHtml(repository, reportGroup) + '\n';
        }
        return source;
    }

    private getListItemHtml(repository: MusicTable, reportGroup: UnitReportGroup): string {
        const musicDetail = repository.find({ id: reportGroup.musicId });
        const difficultyText = Utility.toDifficultyText(reportGroup.difficulty);

        let template = '';
        if (!musicDetail) {
            template = this.unkownMusicTemplate;
            template = template.replace(/%musicId%/g, reportGroup.musicId.toString());
            template = template.replace(/%difficultyLower%/g, difficultyText.toLowerCase());
            return template;
        }

        const report = reportGroup.getMainReport();
        if (!report) {
            template = this.unverifiedListItemTemplate;
            template = template.replace(/%musicName%/g, musicDetail.name);
            template = template.replace(/%difficultyLower%/g, difficultyText.toLowerCase());
            template = template.replace(/%difficulty%/g, difficultyText);
            template = template.replace(/%difficultyImagePath%/g, Utility.getDifficultyImagePath(reportGroup.difficulty));
            return template;
        }

        template = this.listItemTemplate;
        template = template.replace(/%musicName%/g, musicDetail.name);
        template = template.replace(/%difficultyLower%/g, difficultyText.toLowerCase());
        template = template.replace(/%difficulty%/g, difficultyText);
        template = template.replace(/%difficultyImagePath%/g, Utility.getDifficultyImagePath(reportGroup.difficulty));
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
        template = template.replace(/%baseRating%/g, report.calculateBaseRating().toFixed(1));

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
