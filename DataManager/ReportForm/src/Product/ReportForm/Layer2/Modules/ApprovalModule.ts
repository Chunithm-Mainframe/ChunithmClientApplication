import { LogLevel } from "../../../../Packages/CustomLogger/CustomLogger";
import { CustomLogManager } from "../../../../Packages/CustomLogger/CustomLogManager";
import { DIProperty } from "../../../../Packages/DIProperty/DIProperty";
import { WebhookEventName } from "../../Dependencies/WebhookEventDefinition";
import { Difficulty } from "../../Layer1/Difficulty";
import { Environment } from "../../Layer1/Environment";
import { NoticeQueue } from "../@NoticeQueue";
import { Music } from "../Music/Music";
import { ReportStatus } from "../Report/ReportStatus";
import { UnitReport } from "../Report/UnitReport/UnitReport";
import { Utility } from "../Utility";
import { ReportFormModule } from "./@ReportFormModule";
import { ChunirecModule } from "./ChunirecModule";
import { MusicModule } from "./MusicModule";
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
    private get musicModule(): MusicModule { return this.getModule(MusicModule); }
    private get reportModule(): ReportModule { return this.getModule(ReportModule); }
    private get chunirecModule(): ChunirecModule { return this.getModule(ChunirecModule); }
    private get webhookModule(): WebhookModule { return this.getModule(WebhookModule); }

    @DIProperty.inject(NoticeQueue)
    private readonly noticeQueue: NoticeQueue;

    public approve(versionName: string, reportId: number) {
        const report = this.reportModule.getUnitReport(versionName, reportId);
        if (!report) {
            throw new ApprovalError(`検証報告取得の失敗. ID:${reportId}`);
        }

        const table = this.musicModule.getMusicTable(versionName);
        const targetMusic = table.find({ id: report.musicId });
        if (!targetMusic) {
            throw new ApprovalError(`楽曲情報取得の失敗. 楽曲名:${report.musicName}`);
        }

        const baseRating = report.calculateBaseRating();
        Music.setBaseRating(targetMusic, report.difficulty, baseRating);
        Music.setVerified(targetMusic, report.difficulty, true);

        table.update([targetMusic]);
        this.reportModule.approveUnitReport(versionName, reportId);

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
        const report = this.reportModule.getUnitReport(versionName, reportId);
        if (!report) {
            throw new ApprovalError(`検証報告取得の失敗. ID:${reportId}`);
        }
        this.reportModule.rejectUnitReport(versionName, reportId);

        let musicName = report.musicName;
        let difficulty = Utility.toDifficultyText(report.difficulty);
        let baseRating = report.calculateBaseRating();

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
        const unitReportGroups = this.reportModule.getUnitReportGroups(versionName, reportGroupId);
        if (!unitReportGroups) {
            throw new ApprovalError(`報告グループ取得の失敗. ID:${reportGroupId}`);
        }

        const table = this.musicModule.getMusicTable(versionName);
        const targetMusics: Music[] = [];
        const approvedReports: UnitReport[] = [];
        for (const reportGroup of unitReportGroups) {
            const report = reportGroup.getMainReport();
            if (!report || report.reportStatus !== ReportStatus.InProgress) {
                continue;
            }

            approvedReports.push(report);

            const targetMusic = table.find({ id: report.musicId });
            const difficulty = report.difficulty;
            const baseRating = report.calculateBaseRating();
            Music.setBaseRating(targetMusic, difficulty, baseRating);
            Music.setVerified(targetMusic, difficulty, true);
            targetMusics.push(targetMusic);
        }

        table.update(targetMusics);
        this.reportModule.approveMusicReportGroup(versionName, reportGroupId);

        for (const report of approvedReports) {
            const difficulty = Utility.toDifficultyText(report.difficulty);
            const baseRating = report.calculateBaseRating();

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

    private requestChunirecUpdateMusics(reports: UnitReport[]): boolean {
        if (this.configuration.environment !== Environment.Release) {
            return true;
        }
        const params: { musicId: number; difficulty: Difficulty; baseRating: number; }[] = [];
        for (const report of reports) {
            params.push({
                musicId: report.musicId,
                difficulty: report.difficulty,
                baseRating: report.calculateBaseRating(),
            });
        }
        return this.chunirecModule.requestUpdateMusics(params);
    }

    // Lv.1-6用
    public bulkApprove(versionName: string, levelReportId: number): void {
        const levelReport = this.reportModule.getLevelReport(versionName, levelReportId);
        if (!levelReport) {
            throw new ApprovalError(`一括検証報告取得の失敗. ID:${levelReportId}`);
        }

        const targetLevelList = [levelReport.level];

        const table = this.musicModule.getMusicTable(versionName);
        const records = table.records;
        const targetMusics: Music[] = [];
        for (const row of records) {
            let update: Music = null;
            if (targetLevelList.indexOf(row.basicBaseRating) !== -1 && !row.basicVerified) {
                update = row;
                update.basicVerified = true;
            }
            if (targetLevelList.indexOf(row.advancedBaseRating) !== -1 && !row.advancedVerified) {
                update = row;
                update.advancedVerified = true;
            }

            if (update) {
                targetMusics.push(update);
            }
        }

        table.update(targetMusics);

        this.reportModule.approveLevelReport(versionName, levelReportId);

        CustomLogManager.log(
            LogLevel.Info,
            {
                header: '一括承認',
                targetLevel: levelReport.level,
            });

        this.noticeQueue.enqueueApproveLevelReport(levelReport);
        this.noticeQueue.save();

        this.webhookModule.invoke(WebhookEventName.ON_APPROVE);
    }

    public bulkReject(versionName: string, levelReportId: number): void {
        const levelReport = this.reportModule.getLevelReport(versionName, levelReportId);
        if (!levelReport) {
            throw new ApprovalError(`一括検証報告取得の失敗. ID:${levelReportId}`);
        }

        this.reportModule.rejectLevelReport(versionName, levelReportId);

        CustomLogManager.log(
            LogLevel.Info,
            {
                header: '一括却下',
                targetLevel: levelReport.level,
            });

        this.noticeQueue.enqueueRejectLevelReport(levelReport);
        this.noticeQueue.save();
    }

}
