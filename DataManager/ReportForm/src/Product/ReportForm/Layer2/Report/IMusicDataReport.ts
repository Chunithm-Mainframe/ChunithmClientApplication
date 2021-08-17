import { Difficulty } from "../../Layer1/Difficulty";
import { IReport } from "./IReport";
export interface IMusicDataReport {
    readonly musicId: number;
    readonly difficulty: Difficulty;
    readonly reports: IReport[];
    readonly mainReport: IReport;
    readonly valid: boolean;
    readonly verified: boolean;
}
