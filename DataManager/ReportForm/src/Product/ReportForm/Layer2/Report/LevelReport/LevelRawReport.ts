
export class LevelRawReport {
    private _targetLevel: number;
    private _op: number;
    private _opRatio: number;
    private _imagePaths: string[] = [];

    public constructor(post: GoogleAppsScript.Forms.FormResponse) {
        const items = post.getItemResponses();
        const targetLevelText = items[0].getResponse().toString().replace("+", ".5");
        this._targetLevel = parseFloat(targetLevelText);
        this._op = parseFloat(items[1].getResponse().toString());
        this._opRatio = parseFloat(items[2].getResponse().toString());

        if (items[3]) {
            const pathText = items[3].getResponse().toString();
            if (pathText) {
                this._imagePaths = pathText.split(',');
            }
        }
    }

    public get targetLevel(): number {
        return this._targetLevel;
    }
    public get op(): number {
        return this._op;
    }
    public get opRatio(): number {
        return this._opRatio;
    }
    public get imagePaths(): string[] {
        return this._imagePaths.map(function (id) { return `https://drive.google.com/uc?id=${id}`; });
    }
}
