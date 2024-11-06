interface UnitReportInputFormat {
    readonly musicId: number;
    readonly difficulty: Difficulty;
    readonly beforeOp: number;
    readonly afterOp: number;
    readonly score: number;
    readonly comboStatus: ComboStatus;
}
