import { storeConfig } from "../../@operations";
import { LogLevel } from "../../Packages/CustomLogger/CustomLogger";
import { CustomLogManager } from "../../Packages/CustomLogger/CustomLogManager";
import { DIProperty } from "../../Packages/DIProperty/DIProperty";
import { Router } from "../../Packages/Router/Router";
import { Instance } from "./Instance";
import { ReportModule } from "./Layer3/Modules/Report/ReportModule";
import { UnitRawReport } from "./Layer2/Report/UnitReport/UnitRawReport";
import { LevelRawReport } from "./Layer2/Report/LevelReport/LevelRawReport";
import { ReportStatus } from "./Layer2/Report/ReportStatus";
import { PostLocation } from "./Layer2/Report/PostLocation";
import { Utility } from "./Layer2/Utility";
import { ErrorWebsitePresenter } from "./Layer4/WebsitePresenters/ErrorWebsitePresenter";
import { UnitReportTable } from "./Layer2/Report/UnitReport/UnitReportTable";

export type DoGet = GoogleAppsScript.Events.DoGet & { pathInfo: string };

export class ReportForm {
    public static doGet(e: DoGet): GoogleAppsScript.HTML.HtmlOutput {
        try {
            Instance.initialize();
            Instance.instance.registerDoGetParameter(e);
            const response = DIProperty.resolve(Router).call(e.pathInfo ? e.pathInfo : "/");
            if (response === null) {
                throw new Error("page not found");
            }
            return response;
        }
        catch (error) {
            CustomLogManager.exception(error);
            return new ErrorWebsitePresenter().call({ version: Instance.instance.module.configuration.defaultVersionName, message: error.message }, null);
        }
    }

    private static isStoreConfigRequest(postData: { events: { type: string; message: { type: string; text: string } }[] }): boolean {
        if (!postData.events) {
            return false;
        }
        for (const e of postData.events) {
            if (e.type === "message" && e.message.type === "text" && e.message.text === ":store-config") {
                return true;
            }
        }
        return false;
    }

    public static doPost(e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput {
        try {
            CustomLogManager.log(LogLevel.Info, e);

            const postData = JSON.parse(e.postData.contents);

            if (this.isStoreConfigRequest(postData)) {
                storeConfig();
                return this.getSuccessResponseContent();
            }

            Instance.initialize();

            if (!postData.versionName) {
                postData.versionName = Instance.instance.config.defaultVersionName;
            }

            const from: string = e.parameter['from'];
            if (from === 'line') {
                Instance.instance.setupLINEPostCommands();
                const lineCommand = Instance.instance.linePostCommandManager.findController(postData);
                if (lineCommand) {
                    lineCommand.invoke();
                    return this.getSuccessResponseContent();
                }
            }
            else {
                Instance.instance.setupPostCommands();
                const postCommand = Instance.instance.postCommandManager.findPostCommand(postData.command);
                if (postCommand) {
                    const response = postCommand.invoke(postData);
                    return this.getSuccessResponseContent(response);
                }
                else {
                    CustomLogManager.log(LogLevel.Error, 'No command found. ' + postCommand);
                }
            }
            return this.getSuccessResponseContent();
        }
        catch (error) {
            CustomLogManager.exception(error);
            return this.getSuccessResponseContent();
        }
    }

    private static getSuccessResponseContent(response = null): GoogleAppsScript.Content.TextOutput {
        if (!response) {
            response = {};
        }
        response.Success = true;
        return this.getResponseContent(response);
    }

    private static getResponseContent(response): GoogleAppsScript.Content.TextOutput {
        return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
    }

    public static onPost(e: { response: GoogleAppsScript.Forms.FormResponse }, versionName: string): void {
        try {
            Instance.initialize();
            if (!versionName) {
                versionName = Instance.instance.module.configuration.defaultVersionName;
            }

            const report = Instance.instance.module.getModule(ReportModule).insertReport(versionName, new UnitRawReport(e.response));
            if (report) {
                const data = {
                    header: `検証報告`,
                    reportId: report.reportId,
                    musicName: report.musicName,
                    difficulty: Utility.toDifficultyText(report.difficulty),
                    baseRating: report.calculateBaseRating().toFixed(1),
                };
                CustomLogManager.log(LogLevel.Info, data);
                Instance.instance.noticeQueue.enqueueCreateUnitReport(report.reportId);
                Instance.instance.noticeQueue.save();
            }
        }
        catch (error) {
            CustomLogManager.exception(error);
        }
    }

    public static onPostLevelBulkReport(e: { response: GoogleAppsScript.Forms.FormResponse }, versionName = ""): void {
        try {
            Instance.initialize();
            if (!versionName) {
                versionName = Instance.instance.module.configuration.defaultVersionName;
            }
            const levelReport = Instance.instance.module.getModule(ReportModule).insertLevelBulkReport(versionName, new LevelRawReport(e.response));
            if (levelReport) {
                const data = {
                    header: `一括検証報告`,
                    reportId: levelReport.reportId,
                    targetLevel: levelReport.level,
                    musicCount: levelReport.musicCount,
                    op: levelReport.op,
                    opRatio: levelReport.opRatio,
                };
                CustomLogManager.log(LogLevel.Info, data);
                Instance.instance.noticeQueue.enqueueCreateLevelReport(levelReport.reportId);
                Instance.instance.noticeQueue.save();
            }
        }
        catch (error) {
            CustomLogManager.exception(error);
        }
    }

    public static onPostBulkReportImagePaths(e: { response: GoogleAppsScript.Forms.FormResponse }, versionName = ""): void {
        try {
            Instance.initialize();
            if (!versionName) {
                versionName = Instance.instance.module.configuration.defaultVersionName;
            }
            const items = e.response.getItemResponses();
            const musicId = parseInt(items[0].getResponse() as string);
            //const musicName = items[1].getResponse() as string;
            const difficulty = Utility.toDifficulty(items[2].getResponse() as string);
            const imagePaths = items[3].getResponse().toString()
                .split(',')
                .map(p => `https://drive.google.com/uc?id=${p}`);

            const targetReport = Instance.instance.module.getModule(ReportModule).getUnitReports(versionName)
                .filter(x => x.musicId === musicId && x.difficulty === difficulty)
                .find(x => x.postLocation === PostLocation.BulkSheet && x.reportStatus === ReportStatus.InProgress)
            if (targetReport) {
                targetReport.imagePathText = imagePaths.join(',');
                Instance.instance.module.getModule(ReportModule).getUnitReportTable(versionName).update(targetReport);
            }
            else {
                const tableContainer = Instance.instance.module.getModule(ReportModule).getBulkReportTableContainer(versionName);
                const row = tableContainer.getTableByDifficulty(difficulty).getRowByMusicId(musicId);
                if (row && row.isValid()) {
                    const newReport = UnitReportTable.instantiateRecord(row);
                    newReport.postLocation = PostLocation.BulkSheet;
                    Instance.instance.module.getModule(ReportModule).getUnitReportTable(versionName).update(newReport);
                }
                else {
                    // 入力前に画像が投稿された
                    const message = `データが未入力のまま検証画像が投稿されました
楽曲ID: ${musicId}
難易度: ${items[2].getResponse()}
画像URL:
${imagePaths.reduce((acc, src) => acc + '\n' + src)}`
                    CustomLogManager.log(LogLevel.Error, message);
                }
            }
        }
        catch (error) {
            CustomLogManager.exception(error);
        }
    }
}
