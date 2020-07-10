import { Difficulty } from "../../MusicDataTable/Difficulty";
import { ComboStatus } from "../Rating";
import { Utility } from "../Utility";
import { MusicDataTable } from "../../MusicDataTable/MusicDataTable";

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
        let items = post.getItemResponses();
        this._musicnName = PostReportExtends.convertMusicName(items[1].getResponse().toString());
        this._difficulty = Utility.toDifficulty(items[2].getResponse().toString());
        this._beforeOp = parseFloat(items[3].getResponse().toString());
        this._afterOp = parseFloat(items[4].getResponse().toString());
        this._score = parseInt(items[5].getResponse().toString());
        this._comboStatus = Utility.toComboStatus(items[6].getResponse().toString());

        if (items[7]) {
            let pathText = items[7].getResponse().toString();
            if (pathText) {
                this._imagePaths = pathText.split(",");
            }
        }
    }

    public setMusicData(musicDataTable: MusicDataTable): void {
        const musicData = musicDataTable.getMusicDataByName(this.musicName);
        if (musicData) {
            this._musicId = musicData.Id;
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

class PostReportExtends {
    private static convertMusicNameMap: { [key: string]: string } = {
        "�`���m�̃p�[�t�F�N�g���񂷂����� �H���N�o�[�W����": "�`���m�̃p�[�t�F�N�g���񂷂������@�H���N�o�[�W����",
        "���Ă�I �`��������Ă�Ver�`": "���Ă�I�@�`��������Ă�Ver�`",
        "����������ɋ� �` Necro Fantasia": "����������ɋȁ@�`�@Necro Fantasia",
        "�L���A���A�X���g�Ôv �|�Ձ|": "�L���A���A�X���g�Ôv�@�|�Ձ|",
        "�Z�C�N���b�h ���C��": "�Z�C�N���b�h�@���C��",
        "�I�[�P�[�H �I�[���C�I": "�I�[�P�[�H�@�I�[���C�I",
        "�����ň�ȁI Oshama Scramble!": "�����ň�ȁI�@Oshama Scramble!",
        "�D�t���̃��� �`�}�C�P���̂����`": "�D�t���̃����@�`�}�C�P���̂����`",
    };

    public static convertMusicName(musicName: string): string {
        if (musicName in this.convertMusicNameMap) {
            return this.convertMusicNameMap[musicName];
        }
        return musicName;
    }
}