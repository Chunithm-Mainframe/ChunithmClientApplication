interface UnitReportSchema {
    musicId: number;
    musicName: string;
    difficulty: Difficulty;
    beforeOp: number;
    afterOp: number;
    score: number;
    comboStatus: ComboStatus;
    imagePaths?: string[];
}
