import { SlackLogger } from "../../../Packages/CustomLogger.Slack/SlackLogger";
import { ConsoleLogger } from "../../../Packages/CustomLogger/ConsoleLogger";
import { LogLevel } from "../../../Packages/CustomLogger/CustomLogger";
import { CustomLogManager } from "../../../Packages/CustomLogger/CustomLogManager";
import { ReportFormConfiguration } from "../Layer1/Configurations/@ReportFormConfiguration";
import { SpreadsheetLogger } from "../Layer2/Logger/SpreadSheetLogger";

export class LoggerDI {
    public static initialize(config: ReportFormConfiguration): void {
        {
            const logger = new ConsoleLogger();
            CustomLogManager.addLogger(logger);
        }

        if (config.global.logger.spreadsheet && config.global.logger.spreadsheet.id) {
            const logger = new SpreadsheetLogger(
                config.global.logger.spreadsheet.id,
                config.global.logger.spreadsheet.debug,
                config.global.logger.spreadsheet.info,
                config.global.logger.spreadsheet.warning,
                config.global.logger.spreadsheet.error);
            CustomLogManager.addLogger(logger);
        }

        if (config.global.logger.slack && config.global.slackApiToken) {
            const logger = new SlackLogger();
            logger.slackApiToken = config.global.slackApiToken;
            if (config.global.logger.slack.warning?.length > 0) {
                logger.channelIdTable[LogLevel.Warning] = config.global.logger.slack.warning;
            }
            if (config.global.logger.slack.error?.length > 0) {
                logger.channelIdTable[LogLevel.Error] = config.global.logger.slack.error;
            }
            CustomLogManager.addLogger(logger);
        }
    }
}
