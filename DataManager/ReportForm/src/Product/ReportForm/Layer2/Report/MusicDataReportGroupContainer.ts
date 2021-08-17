import { Difficulty } from "../../Layer1/Difficulty";
import { Utility } from "../Utility";
import { MusicDataReportGroup } from "./MusicDataReportGroup";
import { ReportStorage } from "./ReportStorage";

type GroupInfo = { groupId: string, musicInfos: { musicId: number; difficulty: Difficulty }[] };

export class MusicDataReportGroupContainer {
    public static createByStorage(sheet: GoogleAppsScript.Spreadsheet.Sheet, storage: ReportStorage): MusicDataReportGroupContainer {
        const groupInfos: GroupInfo[] = [];
        const groupInfoTableIndexMap: { [groupId: string]: number } = {};

        const table = sheet.getDataRange().getValues();
        table.shift();
        for (const data of table) {
            const groupId = data[0] as string;
            const musicId = data[1] as number;
            const difficulty = Utility.toDifficulty(data[2] as string);

            if (!(groupId in groupInfoTableIndexMap)) {
                const length = groupInfos.push({
                    groupId: groupId,
                    musicInfos: [],
                });
                groupInfoTableIndexMap[groupId] = length - 1;
            }

            groupInfos[groupInfoTableIndexMap[groupId]].musicInfos.push({
                musicId: musicId,
                difficulty: difficulty,
            });
        }
        return new MusicDataReportGroupContainer(groupInfos, storage);
    }

    private readonly _musicDataReportGroup: MusicDataReportGroup[] = [];
    private readonly _musicDataReportGroupIndexMap: { [groupId: string]: number } = {};

    private constructor(groupInfos: GroupInfo[], storage: ReportStorage) {
        for (const info of groupInfos) {
            const group = new MusicDataReportGroup(info.groupId, info.musicInfos, storage);
            const index = this._musicDataReportGroup.push(group) - 1;
            this._musicDataReportGroupIndexMap[info.groupId] = index;
        }
    }

    public get musicDataReportGroups(): MusicDataReportGroup[] {
        return this._musicDataReportGroup;
    }

    public getMusicDataReportGroup(groupId: string): MusicDataReportGroup {
        return this._musicDataReportGroup[this._musicDataReportGroupIndexMap[groupId]];
    }
}
