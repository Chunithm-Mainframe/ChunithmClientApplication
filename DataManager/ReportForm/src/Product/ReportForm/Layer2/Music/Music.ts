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
}
