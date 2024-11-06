class UnverifiedListByLevelListItem {
    public readonly name: string;
    public readonly difficulty: Difficulty;
    public readonly genre: string;
    public readonly level: number;
    public readonly createdAt: Date;

    public constructor(music: Music, difficulty: Difficulty) {
        this.name = music.name;
        this.difficulty = difficulty;
        this.genre = music.genre;
        this.level = Music.getBaseRating(music, difficulty);
        this.createdAt = music.createdAt;
    }
}
