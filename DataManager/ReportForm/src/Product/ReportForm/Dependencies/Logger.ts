import { SlackLogger } from "../../../Packages/CustomLogger.Slack/SlackLogger";
import { ConsoleLogger } from "../../../Packages/CustomLogger/ConsoleLogger";
import { LogLevel } from "../../../Packages/CustomLogger/CustomLogger";
import { CustomLogManager } from "../../../Packages/CustomLogger/CustomLogManager";
import { ReportFormConfiguration } from "../Layer1/Configurations/@ReportFormConfiguration";

export class LoggerDI {
    public static initialize(config: ReportFormConfiguration): void {
        {
            const logger = new ConsoleLogger();
            CustomLogManager.addLogger(logger);
        }
        {
            const logger = new SlackLogger();
            logger.slackApiToken = config.global.slackApiToken;
            logger.channelIdTable[LogLevel.Warning] = [config.global.slackChannelIdTable['alert']];
            logger.channelIdTable[LogLevel.Error] = [config.global.slackChannelIdTable['alert']];
            CustomLogManager.addLogger(logger);
        }
    }
}
