export class UserAgentParser {
    private _userAgent: string = null;
    private _cachedUserAgent = false;
    private _isParsed = false;

    private _product: string;
    public get product(): string {
        this.parse();
        return this._product;
    }

    private _productVersion: string;
    public get productVersion(): string {
        this.parse();
        return this._productVersion;
    }

    private _systemInformation: string;
    public get systemInformation(): string {
        this.parse();
        return this._systemInformation;
    }

    private _extensions: string;
    public get extensions(): string {
        this.parse();
        return this._extensions;
    }

    public getUserAgent(): string {
        if (!this._cachedUserAgent) {
            this._userAgent = HtmlService.getUserAgent();
            this._cachedUserAgent = true;
        }
        return this._userAgent;
    }

    public parse(): void {
        if (this._isParsed) {
            return;
        }

        const userAgent = this.getUserAgent();
        if (!userAgent) {
            this._isParsed = true;
            return;
        }

        const result = /^(?<product>[\S]+)\/(?<productVersion>[\S]+) \((?<systemInformation>.*?)\) (?<extensions>.*)$/.exec(userAgent);
        if (result) {
            this._product = result.groups?.['product'];
            this._productVersion = result.groups?.['productVersion'];
            this._systemInformation = result.groups?.['systemInformation'];
            this._extensions = result.groups?.['extensions'];
        }
        this._isParsed = true;
    }
}
