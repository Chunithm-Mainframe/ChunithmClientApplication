import { MusicData, MusicDataParameter } from "./MusicData";
import { Difficulty } from "../../Layer1/Difficulty";

export class MusicDataTable {
    private table: MusicData[]
    private idMap: { [key: string]: number }
    private nameMap: { [key: string]: number }

    public constructor() {
        this.table = new Array();
        this.idMap = {};
        this.nameMap = {};
    }

    public get datas(): MusicData[] {
        return this.table;
    }

    public getTable(): MusicData[] {
        return this.datas;
    }

    public getMusicDataById(id: number): MusicData {
        if (id !== 0 && !id) {
            return null;
        }

        let index = this.idMap[id.toString()];
        return this.getMusicDataByIndex(index);
    }

    public getMusicDataByName(name: string): MusicData {
        let index = name ? this.nameMap[name] : null;
        return this.getMusicDataByIndex(index);
    }

    private getMusicDataByIndex(index: number): MusicData {
        if (index !== 0 && !index) {
            return null;
        }
        return this.table[index];
    }

    public getTargetLevelMusicCount(targetLevel: number): number {
        var count = 0;
        for (let data of this.datas) {
            if (data.BasicLevel == targetLevel) {
                count++;
            }
            if (data.AdvancedLevel == targetLevel) {
                count++;
            }
        }
        return count;
    }

    public updateMusicDatas(musicDatas: MusicData[]): MusicData[] {
        var updatedMusicDatas = new Array();
        for (var i = 0; i < musicDatas.length; i++) {
            var updatedMusicData = this.updateMusicData(musicDatas[i]);
            if (updatedMusicData) {
                updatedMusicDatas.push(updatedMusicData);
            }
        }
        return updatedMusicDatas;
    }

    public updateMusicData(musicData: MusicData): MusicData {
        if (!musicData) {
            return null;
        }

        let targetMusicData = this.getMusicDataByName(musicData.Name);
        if (!targetMusicData) {
            return null;
        }

        let difficulties = [
            Difficulty.Basic,
            Difficulty.Advanced,
            Difficulty.Expert,
            Difficulty.Master,
        ];
        for (var i = 0; i < difficulties.length; i++) {
            let difficulty = difficulties[i];
            if (!targetMusicData.getVerified(difficulty) && musicData.getLevel(difficulty) > 0 && musicData.getVerified(difficulty)) {
                targetMusicData.setLevel(difficulty, musicData.getLevel(difficulty));
                targetMusicData.setVerified(difficulty, true);
            }
        }

        return targetMusicData;
    }

    public toJson(): string {
        return JSON.stringify({ MusicDatas: this.table });
    }

    public static createByParameters(parameters: MusicDataParameter[]): MusicDataTable {
        let musicDataTable = new MusicDataTable();
        for (var i = 0; i < parameters.length; i++) {
            var musicData = MusicData.createByParameter(parameters[i]);
            musicDataTable.table.push(musicData);
            musicDataTable.idMap[musicData.Id.toString()] = i;
            musicDataTable.nameMap[musicData.Name] = i;
        }
        return musicDataTable;
    }

    public static createBySheet(sheet: GoogleAppsScript.Spreadsheet.Sheet): MusicDataTable {
        let musicDataTable = new MusicDataTable();
        let rows = sheet.getDataRange().getValues();
        for (var i = 1; i < rows.length; i++) {
            let musicData = MusicData.createByRow(rows[i]);
            let index = i - 1;
            musicDataTable.table.push(musicData);
            musicDataTable.idMap[musicData.Id.toString()] = index;
            musicDataTable.nameMap[musicData.Name] = index;
        }
        return musicDataTable;
    }

    public static createByJson(json: string): MusicDataTable {
        let musicDataTable = new MusicDataTable();
        let musicDatas = JSON.parse(json).MusicDatas;
        for (var i = 0; i < musicDatas.length; i++) {
            let musicData = MusicData.createByParameter(musicDatas[i]);
            musicDataTable.table.push(musicData);
            musicDataTable.idMap[musicData.Id.toString()] = i;
            musicDataTable.nameMap[musicData.Name] = i;
        }
        return musicDataTable;
    }

    public static mergeMusicDataTable(oldMusicDataTable: MusicDataTable, newMusicDataTable: MusicDataTable): MusicDataTable {
        let musicDataTable = new MusicDataTable();
        let newTable = newMusicDataTable.getTable();
        for (var i = 0; i < newTable.length; i++) {
            let musicData = new MusicData();
            let oldMusicData = oldMusicDataTable.getMusicDataById(newTable[i].Id);
            musicData.Id = newTable[i].Id;
            musicData.Name = newTable[i].Name || (oldMusicData ? oldMusicData.Name : "");
            musicData.Genre = newTable[i].Genre || (oldMusicData ? oldMusicData.Genre : "");
            musicData.setLevel(Difficulty.Basic, oldMusicData ? oldMusicData.getLevel(Difficulty.Basic) : newTable[i].getLevel(Difficulty.Basic));
            musicData.setLevel(Difficulty.Advanced, oldMusicData ? oldMusicData.getLevel(Difficulty.Advanced) : newTable[i].getLevel(Difficulty.Advanced));
            musicData.setLevel(Difficulty.Expert, oldMusicData ? oldMusicData.getLevel(Difficulty.Expert) : newTable[i].getLevel(Difficulty.Expert));
            musicData.setLevel(Difficulty.Master, oldMusicData ? oldMusicData.getLevel(Difficulty.Master) : newTable[i].getLevel(Difficulty.Master));
            musicData.setVerified(Difficulty.Basic, oldMusicData ? oldMusicData.getVerified(Difficulty.Basic) : false);
            musicData.setVerified(Difficulty.Advanced, oldMusicData ? oldMusicData.getVerified(Difficulty.Advanced) : false);
            musicData.setVerified(Difficulty.Expert, oldMusicData ? oldMusicData.getVerified(Difficulty.Expert) : false);
            musicData.setVerified(Difficulty.Master, oldMusicData ? oldMusicData.getVerified(Difficulty.Master) : false);
            musicDataTable.table.push(musicData);

            let index = i;
            musicDataTable.idMap[musicData.Id.toString()] = index;
            musicDataTable.nameMap[musicData.Name] = index;
        }
        return musicDataTable;
    }
}