import { Role } from "../Role";

export type VersionConfigurationTable = Record<string, VersionConfigurationSchema>;

export interface ReportFormConfigurationSchema {
    readonly global: GlobalConfigurationSchema;
    readonly versions: VersionConfigurationTable;
    readonly webhook: WebhookConfigurationSchema;
}

export interface GlobalConfigurationSchema {
    readonly logSpreadSheetId: string;
    readonly logWorkSheetName: string;
    readonly errorLogSpreadSheetId: string;
    readonly errorLogWorkSheetName: string;
    readonly lineChannelAccessToken: string;
    readonly lineNoticeTargetIdList: string[];
    readonly lineErrorNoticeTargetIdList: string[];
    readonly twitterApiToken: string;
    readonly twitterSecretKey: string;
    readonly rootUrl: string;
    readonly defaultVersionName: string;
    readonly role: Role;
    readonly reportFormId: string;
    readonly bulkReportFormId: string;
    readonly jenkinsApiToken: string;
    readonly chunirecApiHost: string;
    readonly chunirecApiToken: string;
    readonly slackApiToken: string;
    readonly slackChannelIdTable: Record<string, string>;
}

export interface VersionConfigurationSchema {
    readonly displayVersionName: string;
    readonly genres: string[];
    readonly musicSpreadsheetId: string;
    readonly musicWorksheetName: string;
    readonly unitReportSpreadsheetId: string;
    readonly unitReportWorksheetName: string;
    readonly levelReportSpreadsheetId: string;
    readonly levelReportWorksheetName: string;
    readonly masterUnitReportGroupSpreadsheetId: string;
    readonly masterUnitReportGroupWorksheetName: string;
    readonly bulkReportWorksheetName: string;
    readonly bulkReportSpreadsheetId: string;
    readonly nextVersionBulkReportSpreadsheetId: string;
    readonly ratingDataForAnalysisSpreadsheetId: string;
    readonly ratingDataForAnalysisWorksheetName: string;
}

export interface WebhookConfigurationSchema {
    readonly settingsSpreadsheetId: string;
    readonly settingsWorksheetName: string;
}
