import { LogLevel } from "../../../../Packages/CustomLogger/CustomLogger";
import { CustomLogManager } from "../../../../Packages/CustomLogger/CustomLogManager";
import { Environment } from "../../Layer1/Environment";
import { TwitterConnector } from "../../Layer2/Twitter/TwitterConnector";
import { ReportFormModule } from "./@ReportFormModule";

export class TwitterModule extends ReportFormModule {
    private _connector: TwitterConnector;
    public get connector(): TwitterConnector {
        if (!this._connector) {
            const apiToken = this.configuration.global.twitterApiToken;
            const secretKey = this.configuration.global.twitterSecretKey;
            if (!apiToken || !secretKey) {
                const message = `[TwitterModule]Instantiation failed. ${JSON.stringify({
                    apiToken: apiToken,
                    secretKey: secretKey,
                })}`;
                CustomLogManager.log(LogLevel.Error, message);
                return null;
            }
            this._connector = new TwitterConnector(apiToken, secretKey);
        }
        return this._connector;
    }

    public postTweet(message: string) {
        if (!this.configuration.runtime.postTweetEnabled || !this.connector) {
            return null;
        }
        if (this.module.configuration.environment === Environment.Develop) {
            message = "FROM DEV\n" + message;
        }
        return this.connector.postTweet(message);
    }
}
