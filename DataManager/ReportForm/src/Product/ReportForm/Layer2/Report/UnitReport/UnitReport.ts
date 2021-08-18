import { calcBaseRating, ComboStatus } from "../../../Layer1/Rating";
import { Difficulty } from "../../../Layer1/Difficulty";
import { Utility } from "../../Utility";
import { IReport } from "../IReport";
import { ReportInputFormat } from "../ReportInputFormat";
import { ReportStatus } from "../ReportStatus";
import { ColumnIndex, PostLocation } from "../ReportStorage";
export class UnitReport implements IReport {
    public constructor(private readonly _buffer: (string | number | boolean)[]) {
    }
    private _isDirty = false;
    public get isDirty(): boolean {
        return this._isDirty;
    }
    public onUpdateStorage(): void {
        this._isDirty = false;
    }
    public set(reportId: number, reportInput: ReportInputFormat, musicName: string, imagePaths: string[], postLocation: PostLocation, reportStatus: ReportStatus): void {
        this.reportId = reportId;
        this.musicId = reportInput.musicId;
        this.musicName = musicName;
        this.difficulty = reportInput.difficulty;
        this.beforeOp = reportInput.beforeOp;
        this.afterOp = reportInput.afterOp;
        this.score = reportInput.score;
        this.comboStatus = reportInput.comboStatus;
        this.imagePaths = imagePaths;
        this.postLocation = postLocation;
        this.reportStatus = reportStatus;
    }
    public get reportId(): number { return this._buffer[ColumnIndex.ReportId] as number; }
    public set reportId(value: number) { this.setValue(ColumnIndex.ReportId, value); }
    public get musicId(): number { return this._buffer[ColumnIndex.MusicId] as number; }
    public set musicId(value: number) { this.setValue(ColumnIndex.MusicId, value); }
    public get musicName(): string { return this._buffer[ColumnIndex.MusicName] as string; }
    public set musicName(value: string) { this.setValue(ColumnIndex.MusicName, value); }
    private _cachedDifficulty: Difficulty = Difficulty.Invalid;
    public get difficulty(): Difficulty {
        if (this._cachedDifficulty === Difficulty.Invalid) {
            this._cachedDifficulty = Utility.toDifficulty(this._buffer[ColumnIndex.Difficulty] as string);
        }
        return this._cachedDifficulty;
    }
    public set difficulty(value: Difficulty) {
        this._cachedDifficulty = value;
        this.setValue(ColumnIndex.Difficulty, Utility.toDifficultyText(value));
    }
    public get beforeOp(): number { return this._buffer[ColumnIndex.BeforeOp] as number; }
    public set beforeOp(value: number) { this.setValue(ColumnIndex.BeforeOp, value); }
    public get afterOp(): number { return this._buffer[ColumnIndex.AfterOp] as number; }
    public set afterOp(value: number) { this.setValue(ColumnIndex.AfterOp, value); }
    public get score(): number { return this._buffer[ColumnIndex.Score] as number; }
    public set score(value: number) { this.setValue(ColumnIndex.Score, value); }
    public get comboStatus(): ComboStatus { return this._buffer[ColumnIndex.ComboStatus] as ComboStatus; }
    public set comboStatus(value: ComboStatus) { this.setValue(ColumnIndex.ComboStatus, value); }
    private _cachedImagePaths: string[] = null;
    public get imagePaths(): string[] {
        if (!this._cachedImagePaths) {
            const str = this._buffer[ColumnIndex.ImagePaths] as string;
            this._cachedImagePaths = str ? str.split(',') : [];
        }
        return this._cachedImagePaths;
    }
    public set imagePaths(value: string[]) {
        if (!value || value.length === 0) {
            this._cachedImagePaths = [];
            this.setValue(ColumnIndex.ImagePaths, '');
        }
        else {
            this._cachedImagePaths = value;
            this.setValue(ColumnIndex.ImagePaths, value.reduce((previous, current) => previous + ',' + current));
        }
    }
    public get postLocation(): PostLocation { return this._buffer[ColumnIndex.PostLocation] as PostLocation; }
    public set postLocation(value: PostLocation) { this.setValue(ColumnIndex.PostLocation, value); }
    public get reportStatus(): ReportStatus { return this._buffer[ColumnIndex.ReportStatus] as ReportStatus; }
    public set reportStatus(value: ReportStatus) { this.setValue(ColumnIndex.ReportStatus, value); }
    private setValue(index: ColumnIndex, value: (string | number | boolean)): void {
        if (this._buffer[index] !== value) {
            this._buffer[index] = value;
            this._isDirty = true;
        }
    }
    public calcBaseRating(): number {
        let comboStatus = ComboStatus.None;
        switch (this.comboStatus) {
            case ComboStatus.AllJustice:
                comboStatus = ComboStatus.AllJustice;
                break;
            case ComboStatus.FullCombo:
                comboStatus = ComboStatus.FullCombo;
                break;
        }
        return calcBaseRating(this.beforeOp, this.afterOp, this.score, comboStatus);
    }
    public setImagePaths(imagePaths: string[]): void {
        this.imagePaths = imagePaths;
    }
}
