declare namespace TwitterWebServiceDefinition {
    interface Provider {
        getInstance(consumer_key: string, consumre_secret: string): ITwitterWebService;
    }

    interface ITwitterWebService {
        getService(): Service;
        authorize(): void;
        reset(): void;
        authCallback(request: object): void;
    }
}

declare var TwitterWebService: TwitterWebServiceDefinition.Provider;
