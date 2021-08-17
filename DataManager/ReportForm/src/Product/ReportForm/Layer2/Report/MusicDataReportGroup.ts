import { Difficulty } from "../../Layer1/Difficulty";
import { IMusicDataReport } from "./IMusicDataReport";
import { ReportStorage } from "./ReportStorage";

export class MusicDataReportGroup {
    public constructor(private _groupId: string, private _params: { musicId: number; difficulty: Difficulty }[], private _storage: ReportStorage) {
    }

    public get groupId(): string {
        return this._groupId;
    }

    public getMusicDataReports(): IMusicDataReport[] {
        return this._params.map(p => this._storage.getMusicDataReport(p.musicId, p.difficulty));
    }

    public get verified(): boolean {
        return this.getMusicDataReports().every(r => !r.valid || r.verified);
    }
}
