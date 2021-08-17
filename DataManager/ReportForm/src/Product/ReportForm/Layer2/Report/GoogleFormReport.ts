import { Difficulty } from "../../Layer1/Difficulty";
import { ComboStatus } from "../../Layer1/Rating";
import { MusicRepository } from "../Music/MusicRepository";
import { Utility } from "../Utility";

class PostReportExtends {
    private static convertMusicNameMap: { [key: string]: string } = {
        "チルノのパーフェクトさんすう教室 ⑨周年バージョン": "チルノのパーフェクトさんすう教室　⑨周年バージョン",
        "ってゐ！ 〜えいえんてゐVer〜": "ってゐ！　〜えいえんてゐVer〜",
        "少女幻葬戦慄曲 〜 Necro Fantasia": "少女幻葬戦慄曲　〜　Necro Fantasia",
        "キュアリアス光吉古牌 −祭−": "キュアリアス光吉古牌　−祭−",
        "セイクリッド ルイン": "セイクリッド　ルイン",
        "オーケー？ オーライ！": "オーケー？　オーライ！",
        "ここで一席！ Oshama Scramble!": "ここで一席！　Oshama Scramble!",
        "札付きのワル 〜マイケルのうた〜": "札付きのワル　〜マイケルのうた〜",
    };

    public static convertMusicName(musicName: string): string {
        if (musicName in this.convertMusicNameMap) {
            return this.convertMusicNameMap[musicName];
        }
        return musicName;
    }
}

export class GoogleFormReport {
    private _musicId: number;
    private _musicnName = "";
    private _difficulty: Difficulty = Difficulty.Invalid;
    private _beforeOp: number;
    private _afterOp: number;
    private _score: number;
    private _comboStatus: ComboStatus = ComboStatus.None;
    private _imagePaths: string[] = [];

    public constructor(post: GoogleAppsScript.Forms.FormResponse) {
        const items = post.getItemResponses();
        this._musicnName = PostReportExtends.convertMusicName(items[1].getResponse().toString());
        this._difficulty = Utility.toDifficulty(items[2].getResponse().toString());
        this._beforeOp = parseFloat(items[3].getResponse().toString());
        this._afterOp = parseFloat(items[4].getResponse().toString());
        this._score = parseInt(items[5].getResponse().toString());
        this._comboStatus = Utility.toComboStatus(items[6].getResponse().toString());

        if (items[7]) {
            const pathText = items[7].getResponse().toString();
            if (pathText) {
                this._imagePaths = pathText.split(",");
            }
        }
    }

    public bindMusic(repository: MusicRepository): void {
        const music = repository.getByName(this.musicName);
        if (music) {
            this._musicId = music.id;
        }
    }

    public get musicId(): number {
        return this._musicId;
    }
    public get musicName(): string {
        return this._musicnName;
    }
    public get difficulty(): Difficulty {
        return this._difficulty;
    }
    public get beforeOp(): number {
        return this._beforeOp;
    }
    public get afterOp(): number {
        return this._afterOp;
    }
    public get score(): number {
        return this._score;
    }
    public get comboStatus(): ComboStatus {
        return this._comboStatus;
    }
    public get imagePaths(): string[] {
        return this._imagePaths.map(function (id) { return `https://drive.google.com/uc?id=${id}`; });
    }
}
