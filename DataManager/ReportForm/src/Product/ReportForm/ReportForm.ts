import { storeConfig } from "../../@operations";
import { LogLevel } from "../../Packages/CustomLogger/CustomLogger";
import { CustomLogManager } from "../../Packages/CustomLogger/CustomLogManager";
import { DIProperty } from "../../Packages/DIProperty/DIProperty";
import { Router } from "../../Packages/Router/Router";
import { Instance } from "./Instance";
import { ReportModule } from "./Layer2/Modules/Report/ReportModule";
import { GoogleFormReport } from "./Layer2/Report/GoogleFormReport";
import { GoogleFormLevelBulkReport } from "./Layer2/Report/LevelBulkReport/GoogleFormLevelBulkReport";
import { ReportStatus } from "./Layer2/Report/ReportStatus";
import { PostLocation } from "./Layer2/Report/ReportStorage";
import { Utility } from "./Layer2/Utility";
import { ErrorWebsiteController } from "./Layer3/WebsiteControllers/ErrorWebsiteController";

export type DoGet = GoogleAppsScript.Events.DoGet & { pathInfo: string };

export class ReportForm {
    public static doGet(e: DoGet): GoogleAppsScript.HTML.HtmlOutput {
        try {
            Instance.initialize();
            Instance.instance.registerDoGetParameter(e);
            return DIProperty.resolve(Router).call(e.pathInfo ? e.pathInfo : "/");
        }
        catch (error) {
            CustomLogManager.exception(error);
            return new ErrorWebsiteController().call({ version: Instance.instance.module.configuration.defaultVersionName, message: error.message }, null);
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
                Instance.instance.setupLINEPostCommandControllers();
                const lineCommand = Instance.instance.linePostCommandManager.findController(postData);
                if (lineCommand) {
                    lineCommand.invoke();
                    return this.getSuccessResponseContent();
                }
            }
            else {
                Instance.instance.setupPostCommandControllers();
                const postCommand = Instance.instance.postCommandManager.findController(postData.API);
                if (postCommand) {
                    const response = postCommand.invoke(postData);
                    return this.getSuccessResponseContent(response);
                }
            }
            return this.getSuccessResponseContent();
        }
        catch (error) {
            CustomLogManager.exception(error);
            return this.getSuccessResponseContent();
        }
    }

    private static getSuccessResponseContent(response: any = null): GoogleAppsScript.Content.TextOutput {
        if (!response) {
            response = {};
        }
        response.Success = true;
        return this.getResponseContent(response);
    }

    private static getResponseContent(response: any): GoogleAppsScript.Content.TextOutput {
        return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
    }

    public static onPost(e: { response: GoogleAppsScript.Forms.FormResponse }, versionName = ""): void {
        try {
            Instance.initialize();
            if (!versionName) {
                versionName = Instance.instance.module.configuration.defaultVersionName;
            }

            let report = Instance.instance.module.getModule(ReportModule).insertReport(versionName, new GoogleFormReport(e.response));
            if (report) {
                const data = {
                    header: `検証報告`,
                    reportId: report.reportId,
                    musicName: report.musicName,
                    difficulty: Utility.toDifficultyText(report.difficulty),
                    baseRating: report.calcBaseRating().toFixed(1),
                };
                CustomLogManager.log(LogLevel.Info, data);

                Instance.getNoticeQueue().enqueueCreateUnitReport(report);
            }
        }
        catch (error) {
            CustomLogManager.exception(error);
        }
    }

    public static onPostLevelBulkReport(e: { response: GoogleAppsScript.Forms.FormResponse }, versionName: string = ""): void {
        try {
            Instance.initialize();
            if (!versionName) {
                versionName = Instance.instance.module.configuration.defaultVersionName;
            }
            let bulkReport = Instance.instance.module.getModule(ReportModule).insertLevelBulkReport(versionName, new GoogleFormLevelBulkReport(e.response));
            if (bulkReport) {
                const data = {
                    header: `一括検証報告`,
                    reportId: bulkReport.reportId,
                    targetLevel: bulkReport.targetLevel,
                    musicCount: bulkReport.musicCount,
                    op: bulkReport.op,
                    opRatio: bulkReport.opRatio,
                };
                CustomLogManager.log(LogLevel.Info, data);
                Instance.getNoticeQueue().enqueueCreateLevelReport(bulkReport);
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

            const targetReport = Instance.instance.module.getModule(ReportModule)
                .getReportStorage(versionName)
                .getMusicDataReport(musicId, difficulty)
                .find(r => r.postLocation === PostLocation.BulkSheet && r.reportStatus === ReportStatus.InProgress);
            if (targetReport) {
                targetReport.setImagePaths(imagePaths);
                Instance.instance.module.getModule(ReportModule).getReportStorage(versionName).write();
            }
            else {
                const tableContainer = Instance.instance.module.getModule(ReportModule).getBulkReportTableContainer(versionName);
                const row = tableContainer.getTableByDifficulty(difficulty).getRowByMusicId(musicId);
                if (row && row.isValid()) {
                    Instance.instance.module.getModule(ReportModule)
                        .getReportStorage(versionName)
                        .push(row, PostLocation.BulkSheet, imagePaths);
                    Instance.instance.module.getModule(ReportModule).getReportStorage(versionName).write();
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
