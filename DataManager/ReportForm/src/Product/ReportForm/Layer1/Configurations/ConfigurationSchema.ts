import { Role } from "../Role";

export type VersionConfigurationTable = Record<string, VersionConfigurationSchema>;

export interface ReportFormConfigurationSchema {
    readonly global: GlobalConfigurationSchema;
    readonly versions: VersionConfigurationTable;
    readonly webhook: WebhookConfigurationSchema;
}

export interface GlobalConfigurationSchema {
    readonly logger: LoggerConfigurationSchema;
    readonly lineChannelAccessToken: string;
    readonly lineNoticeTargetIdList: string[];
    readonly twitterApiToken: string;
    readonly twitterSecretKey: string;
    readonly rootUrl: string;
    readonly defaultVersionName: string;
    readonly role: Role;
    readonly unitReportGroupByGenreFormId: string;
    readonly unitReportGroupByLevelFormId: string;
    readonly levelReportFormId: string;
    readonly chunirecApiHost: string;
    readonly chunirecApiToken: string;
    readonly slackApiToken: string;
    readonly slackChannelIdTable: Record<string, string>;
}

export interface LoggerConfigurationSchema {
    readonly slack: {
        readonly debug: string[];
        readonly info: string[];
        readonly warning: string[];
        readonly error: string[];
    };
    readonly line: {
        readonly debug: string[];
        readonly info: string[];
        readonly warning: string[];
        readonly error: string[];
    };
    readonly spreadsheet: {
        readonly id: string;
        readonly debug: string;
        readonly info: string;
        readonly warning: string;
        readonly error: string;
    };
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
    readonly playerRatingSpreadsheetId: string;
    readonly playerRatingWorksheetName: string;
}

export interface WebhookConfigurationSchema {
    readonly settingsSpreadsheetId: string;
    readonly settingsWorksheetName: string;
}
