import * as TwitterWebService from "../../../../../Dependencies/TwitterWebService";

export class TwitterConnector {
    private twitter: TwitterWebService.ITwitterWebService;

    public constructor(apiToken: string, secretKey: string) {
        this.twitter = TwitterWebService.getInstance(apiToken, secretKey);
    }

    public authorize() {
        this.twitter.authorize();
    }

    public authCallback(request): void {
        this.twitter.authCallback(request);
    }

    // eslint-disable-next-line
    public postTweet(message: string): GoogleAppsScript.URL_Fetch.HTTPResponse {
        const service = this.twitter.getService();
        const endPointUrl = 'https://api.twitter.com/1.1/statuses/update.json';
        const response = service.fetch(endPointUrl, {
            method: 'post',
            payload: {
                status: message
            }
        });
        return response;
    }
}
