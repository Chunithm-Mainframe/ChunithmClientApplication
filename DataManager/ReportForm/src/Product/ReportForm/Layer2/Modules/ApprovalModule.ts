import { LogLevel } from "../../../../Packages/CustomLogger/CustomLogger";
import { CustomLogManager } from "../../../../Packages/CustomLogger/CustomLogManager";
import { DIProperty } from "../../../../Packages/DIProperty/DIProperty";
import { WebhookEventName } from "../../Dependencies/WebhookEventDefinition";
import { Environment } from "../../Layer1/Environment";
import { Difficulty } from "../../Layer1/Difficulty";
import { MusicData } from "../MusicDataTable/MusicData";
import { IReport } from "../Report/IReport";
import { ReportStatus } from "../Report/ReportStatus";
import { Utility } from "../Utility";
import { ReportFormModule } from "./@ReportFormModule";
import { ChunirecModule } from "./ChunirecModule";
import { MusicDataModule } from "./MusicDataModule";
import { NoticeQueue } from "../@NoticeQueue";
import { ReportModule } from "./Report/ReportModule";
import { WebhookModule } from "./WebhookModule";

export class ApprovalError implements Error {
    public name: string = "ApprovalError";
    public message: string;
    public constructor(message: string) {
        this.message = message;
    }

    toString(): string {
        return `${this.name}:${this.message};`
    }
}

export class ApprovalModule extends ReportFormModule {
    private get musicDataModule(): MusicDataModule { return this.getModule(MusicDataModule); }
    private get reportModule(): ReportModule { return this.getModule(ReportModule); }
    private get chunirecModule(): ChunirecModule { return this.getModule(ChunirecModule); }
    private get webhookModule(): WebhookModule { return this.getModule(WebhookModule); }

    @DIProperty.inject(NoticeQueue)
    private readonly noticeQueue: NoticeQueue;

    public approve(versionName: string, reportId: number) {
        const report = this.reportModule.getReport(versionName, reportId);
        if (!report) {
            throw new ApprovalError(`検証報告取得の失敗. ID:${reportId}`);
        }

        let musicDataTable = this.musicDataModule.getTable(versionName);
        let targetMusicData = musicDataTable.getMusicDataById(report.musicId);
        if (!targetMusicData) {
            throw new ApprovalError(`楽曲情報取得の失敗. 楽曲名:${report.musicName}`);
        }
        targetMusicData = targetMusicData.clone();

        let baseRating = report.calcBaseRating();
        switch (report.difficulty) {
            case Difficulty.Master:
                targetMusicData.setLevel(Difficulty.Master, baseRating);
                targetMusicData.setVerified(Difficulty.Master, true);
                break;
            case Difficulty.Expert:
                targetMusicData.setLevel(Difficulty.Expert, baseRating);
                targetMusicData.setVerified(Difficulty.Expert, true);
                break;
            case Difficulty.Advanced:
                targetMusicData.setLevel(Difficulty.Advanced, baseRating);
                targetMusicData.setVerified(Difficulty.Advanced, true);
                break;
            case Difficulty.Basic:
                targetMusicData.setLevel(Difficulty.Basic, baseRating);
                targetMusicData.setVerified(Difficulty.Basic, true);
                break;
        }

        this.musicDataModule.updateMusicData(versionName, [targetMusicData]);
        this.reportModule.approve(versionName, reportId);

        this.requestChunirecUpdateMusics([report]);
        this.webhookModule.invoke(WebhookEventName.ON_APPROVE);

        const difficulty = Utility.toDifficultyText(report.difficulty);
        CustomLogManager.log(
            LogLevel.Info,
            {
                'header': '検証報告承認',
                'reportId': report.reportId,
                'musicName': report.musicName,
                'difficulty': difficulty,
                'baseRating': baseRating.toFixed(1),
            });

        this.noticeQueue.enqueueApproveUnitReport(report);
        this.noticeQueue.save();
    }

    public reject(versionName: string, reportId: number): void {
        const report = this.reportModule.getReport(versionName, reportId);
        if (!report) {
            throw new ApprovalError(`検証報告取得の失敗. ID:${reportId}`);
        }
        this.reportModule.reject(versionName, reportId);

        let musicName = report.musicName;
        let difficulty = Utility.toDifficultyText(report.difficulty);
        let baseRating = report.calcBaseRating();

        CustomLogManager.log(
            LogLevel.Info,
            {
                'header': '検証報告却下',
                'reportId': report.reportId,
                'musicName': report.musicName,
                'difficulty': difficulty,
                'baseRating': baseRating.toFixed(1),
            });

        this.noticeQueue.enqueueRejectUnitReport(report);
        this.noticeQueue.save();
    }

    public approveGroup(versionName: string, reportGroupId: string): void {
        const reportGroup = this.reportModule
            .getMusicDataReportGroupContainer(versionName)
            .getMusicDataReportGroup(reportGroupId);
        if (!reportGroup) {
            throw new ApprovalError(`報告グループ取得の失敗. ID:${reportGroupId}`);
        }

        const musicDataTable = this.musicDataModule.getTable(versionName);
        const targetMusicDatas: MusicData[] = [];
        const approvedReports: IReport[] = [];
        for (const rep of reportGroup.getMusicDataReports()) {
            if (!rep.mainReport || rep.mainReport.reportStatus !== ReportStatus.InProgress) {
                continue;
            }

            const report = rep.mainReport;
            approvedReports.push(report);

            const targetMusicData = musicDataTable.getMusicDataById(report.musicId).clone();
            const difficulty = report.difficulty;
            const baseRating = report.calcBaseRating();
            switch (difficulty) {
                case Difficulty.Master:
                    targetMusicData.setLevel(Difficulty.Master, baseRating);
                    targetMusicData.setVerified(Difficulty.Master, true);
                    break;
                case Difficulty.Expert:
                    targetMusicData.setLevel(Difficulty.Expert, baseRating);
                    targetMusicData.setVerified(Difficulty.Expert, true);
                    break;
                case Difficulty.Advanced:
                    targetMusicData.setLevel(Difficulty.Advanced, baseRating);
                    targetMusicData.setVerified(Difficulty.Advanced, true);
                    break;
                case Difficulty.Basic:
                    targetMusicData.setLevel(Difficulty.Basic, baseRating);
                    targetMusicData.setVerified(Difficulty.Basic, true);
                    break;
            }
            targetMusicDatas.push(targetMusicData);
        }

        this.musicDataModule.updateMusicData(versionName, targetMusicDatas);
        this.reportModule.approveGroup(versionName, approvedReports.map(r => r.reportId));

        for (const report of approvedReports) {
            const difficulty = Utility.toDifficultyText(report.difficulty);
            const baseRating = report.calcBaseRating();

            CustomLogManager.log(
                LogLevel.Info,
                {
                    'header': '検証報告承認',
                    'reportId': report.reportId,
                    'musicName': report.musicName,
                    'difficulty': difficulty,
                    'baseRating': baseRating.toFixed(1),
                });

            this.noticeQueue.enqueueApproveUnitReport(report);
        }

        this.requestChunirecUpdateMusics(approvedReports);
        this.noticeQueue.save();
        this.webhookModule.invoke(WebhookEventName.ON_APPROVE);

        this.reportModule.noticeReportPost(`検証報告グループが一括承認されました
グループID: ${reportGroupId}`);
    }

    private requestChunirecUpdateMusics(reports: IReport[]): boolean {
        if (this.configuration.environment !== Environment.Release) {
            return true;
        }
        const params: { musicId: number; difficulty: Difficulty; baseRating: number; }[] = [];
        for (const report of reports) {
            params.push({
                musicId: report.musicId,
                difficulty: report.difficulty,
                baseRating: report.calcBaseRating(),
            });
        }
        return this.chunirecModule.requestUpdateMusics(params);
    }

    // Lv.1-6用
    public bulkApprove(versionName: string, bulkReportId: number): void {
        const bulkReport = this.reportModule.getLevelBulkReportSheet(versionName).getBulkReport(bulkReportId);
        if (!bulkReport) {
            throw new ApprovalError(`一括検証報告取得の失敗. ID:${bulkReportId}`);
        }

        const targetLevelList = [bulkReport.targetLevel];

        const musicDataTable = this.musicDataModule.getTable(versionName);
        const targetMusicDatas: MusicData[] = [];
        for (const data of musicDataTable.datas) {
            let update: MusicData = null;
            if (targetLevelList.indexOf(data.BasicLevel) !== -1 && !data.BasicVerified) {
                update = update || data.clone();
                update.BasicVerified = true;
            }
            if (targetLevelList.indexOf(data.AdvancedLevel) !== -1 && !data.AdvancedVerified) {
                update = update || data.clone();
                update.AdvancedVerified = true;
            }

            if (update) {
                targetMusicDatas.push(update);
            }
        }

        this.musicDataModule.updateMusicData(versionName, targetMusicDatas);
        this.reportModule.approveLevelBulkReport(versionName, bulkReportId);

        CustomLogManager.log(
            LogLevel.Info,
            {
                header: '一括承認',
                targetLevel: bulkReport.targetLevel,
            });

        this.noticeQueue.enqueueApproveLevelReport(bulkReport);
        this.noticeQueue.save();

        this.webhookModule.invoke(WebhookEventName.ON_APPROVE);
    }

    public bulkReject(versionName: string, bulkReportId: number): void {
        const bulkReport = this.reportModule.getLevelBulkReportSheet(versionName).getBulkReport(bulkReportId);
        if (!bulkReport) {
            throw new ApprovalError(`一括検証報告取得の失敗. ID:${bulkReportId}`);
        }

        this.reportModule.rejectLevelBulkReport(versionName, bulkReportId);

        CustomLogManager.log(
            LogLevel.Info,
            {
                header: '一括却下',
                targetLevel: bulkReport.targetLevel,
            });

        this.noticeQueue.enqueueRejectLevelReport(bulkReport);
        this.noticeQueue.save();
    }

}
