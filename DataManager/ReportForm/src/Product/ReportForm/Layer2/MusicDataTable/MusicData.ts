import { Difficulty } from "../../Layer1/Difficulty";

export interface MusicDataParameter {
    Id: number;
    Name: string;
    Genre: string;
    BasicLevel: number;
    AdvancedLevel: number;
    ExpertLevel: number;
    MasterLevel: number;
    BasicVerified: boolean;
    AdvancedVerified: boolean;
    ExpertVerified: boolean;
    MasterVerified: boolean;
}

export class MusicData {
    public Id: number
    public Name: string
    public Genre: string
    public BasicLevel: number
    public AdvancedLevel: number
    public ExpertLevel: number
    public MasterLevel: number
    public BasicVerified: boolean
    public AdvancedVerified: boolean
    public ExpertVerified: boolean
    public MasterVerified: boolean

    public constructor() {
        this.Id = -1;
        this.Name = "";
        this.Genre = "";
        this.BasicLevel = 0;
        this.AdvancedLevel = 0;
        this.ExpertLevel = 0;
        this.MasterLevel = 0;
        this.BasicVerified = false;
        this.AdvancedVerified = false;
        this.ExpertVerified = false;
        this.MasterVerified = false;
    }

    public getLevel(difficulty: Difficulty): number {
        switch (difficulty) {
            case Difficulty.Basic:
                return this.BasicLevel;
            case Difficulty.Advanced:
                return this.AdvancedLevel;
            case Difficulty.Expert:
                return this.ExpertLevel;
            case Difficulty.Master:
                return this.MasterLevel;
        }
        return 0;
    }

    public setLevel(difficulty: Difficulty, level: number): void {
        switch (difficulty) {
            case Difficulty.Basic:
                this.BasicLevel = level;
                break;
            case Difficulty.Advanced:
                this.AdvancedLevel = level;
                break;
            case Difficulty.Expert:
                this.ExpertLevel = level;
                break;
            case Difficulty.Master:
                this.MasterLevel = level;
                break;
        }
    }

    public getVerified(difficulty: Difficulty): boolean {
        switch (difficulty) {
            case Difficulty.Basic:
                return this.BasicVerified;
            case Difficulty.Advanced:
                return this.AdvancedVerified;
            case Difficulty.Expert:
                return this.ExpertVerified;
            case Difficulty.Master:
                return this.MasterVerified;
        }
        return false;
    }

    public setVerified(difficulty: Difficulty, verified: boolean): void {
        switch (difficulty) {
            case Difficulty.Basic:
                this.BasicVerified = verified;
                break;
            case Difficulty.Advanced:
                this.AdvancedVerified = verified;
                break;
            case Difficulty.Expert:
                this.ExpertVerified = verified;
                break;
            case Difficulty.Master:
                this.MasterVerified = verified;
                break;
        }
    }

    public clone(): MusicData {
        return MusicData.createByParameter(this);
    }

    public static createByParameter(parameter: MusicDataParameter): MusicData {
        var musicData = new MusicData();

        musicData.Id = parameter.Id;
        musicData.Name = parameter.Name;
        musicData.Genre = parameter.Genre;
        musicData.BasicLevel = parameter.BasicLevel;
        musicData.AdvancedLevel = parameter.AdvancedLevel;
        musicData.ExpertLevel = parameter.ExpertLevel;
        musicData.MasterLevel = parameter.MasterLevel;
        musicData.BasicVerified = parameter.BasicVerified;
        musicData.AdvancedVerified = parameter.AdvancedVerified;
        musicData.ExpertVerified = parameter.ExpertVerified;
        musicData.MasterVerified = parameter.MasterVerified;

        return musicData;
    }

    public static createByRow(row: any[]): MusicData {
        var musicData = new MusicData();

        musicData.Id = row[1];
        musicData.Name = row[2];
        musicData.Genre = row[3];
        musicData.BasicLevel = row[4];
        musicData.AdvancedLevel = row[5];
        musicData.ExpertLevel = row[6];
        musicData.MasterLevel = row[7];
        musicData.BasicVerified = row[8];
        musicData.AdvancedVerified = row[9];
        musicData.ExpertVerified = row[10];
        musicData.MasterVerified = row[11];

        return musicData;
    }
}
