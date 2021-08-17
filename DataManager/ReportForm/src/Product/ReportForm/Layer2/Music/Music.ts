import { Difficulty } from "../../Layer1/Difficulty";

export class Music {
    public id = 0;
    public name = '';
    public genre = '';
    public basicBaseRating = 0;
    public advancedBaseRating = 0;
    public expertBaseRating = 0;
    public masterBaseRating = 0;
    public basicVerified = false;
    public advancedVerified = false;
    public expertVerified = false;
    public masterVerified = false;
    public enabled = true;

    private static _baseRatingKeyMap: Record<number, keyof Music> = null;
    private static get baseRatingKeyMap(): Record<Difficulty, keyof Music> {
        if (!this._baseRatingKeyMap) {
            this._baseRatingKeyMap = {};
            this._baseRatingKeyMap[Difficulty.Basic] = 'basicBaseRating';
            this._baseRatingKeyMap[Difficulty.Advanced] = 'advancedBaseRating';
            this._baseRatingKeyMap[Difficulty.Expert] = 'expertBaseRating';
            this._baseRatingKeyMap[Difficulty.Master] = 'masterBaseRating';
        }
        return this._baseRatingKeyMap;
    }

    private static _verifiedKeyMap: Record<number, keyof Music> = null;
    private static get verifiedKeyMap(): Record<Difficulty, keyof Music> {
        if (!this._verifiedKeyMap) {
            this._verifiedKeyMap = {};
            this._verifiedKeyMap[Difficulty.Basic] = 'basicVerified';
            this._verifiedKeyMap[Difficulty.Advanced] = 'advancedVerified';
            this._verifiedKeyMap[Difficulty.Expert] = 'expertVerified';
            this._verifiedKeyMap[Difficulty.Master] = 'masterVerified';
        }
        return this._verifiedKeyMap;
    }

    public static instantiate(obj: Required<Music>): Music {
        const instance = new Music();
        for (const key in instance) {
            instance[key] = obj[key];
        }
        return instance;
    }

    public apply<TKey extends keyof Music>(key: TKey, value: Music[TKey]): Music {
        const self: Music = this;
        self[key] = value;
        return this;
    }

    public static getBaseRating(music: Required<Music>, difficulty: Difficulty): number {
        const key = Music.baseRatingKeyMap[difficulty];
        return key ? music[key] as number : 0;
    }

    public static setBaseRating(music: Required<Music>, difficulty: Difficulty, baseRating: number): void {
        const key = Music.baseRatingKeyMap[difficulty];
        if (key) {
            music.apply(key, baseRating);
        }
    }

    public static getVerified(music: Required<Music>, difficulty: Difficulty): boolean {
        const key = Music.verifiedKeyMap[difficulty];
        return key ? music[key] as boolean : false;
    }

    public static setVerified(music: Required<Music>, difficulty: Difficulty, verified: boolean): void {
        const key = Music.verifiedKeyMap[difficulty];
        if (key) {
            music.apply(key, verified);
        }
    }
}
