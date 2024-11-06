class WebhookSettings {
    private _callback: string;
    public get callback(): string {
        return this._callback;
    }

    private _header: { [key: string]: string; };
    public get header(): { [key: string]: string; } {
        return this._header;
    }

    public constructor(callback: string, headerJson?: string) {
        this._callback = callback;
        this._header = headerJson ? JSON.parse(headerJson) : {};
    }
}
