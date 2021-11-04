export enum Rank {
    None,
    D,
    C,
    B,
    BB,
    BBB,
    A,
    AA,
    AAA,
    S,
    SA,
    SS,
    SSA,
    SSS,
    SSSA,
    Max,
}

export enum ComboStatus {
    None,
    FullCombo,
    AllJustice,
}

export enum ChainStatus {
    None,
    FullChainGold,
    FullChainPlatinum,
}

const borderScoreMap: Record<Rank, number> = {
    [Rank.None]: 0,
    [Rank.D]: 0,
    [Rank.C]: 500000,
    [Rank.B]: 600000,
    [Rank.BB]: 700000,
    [Rank.BBB]: 800000,
    [Rank.A]: 900000,
    [Rank.AA]: 925000,
    [Rank.AAA]: 950000,
    [Rank.S]: 975000,
    [Rank.SA]: 990000,
    [Rank.SS]: 1000000,
    [Rank.SSA]: 1005000,
    [Rank.SSS]: 1007500,
    [Rank.SSSA]: 1009000,
    [Rank.Max]: 1010000,
};

function getBorderScore(rank: Rank): number {
    return borderScoreMap[rank];
}

function getBorderBaseRating(levelText: string): number {
    let integer = 0;
    let decimal = 0;

    if (levelText.indexOf("+") !== -1) {
        decimal = 0.5;
    }

    levelText = levelText.replace("+", "");
    integer = parseInt(levelText);
    if (isNaN(integer)) {
        return 0;
    }

    return integer + decimal;
}

function convertToIntegerRating(rating: number): number {
    return Math.round(rating * 100);
}

function getBordersAsIntegerRating(integerBaseRating: number, asOverPower: boolean): { score: number; integerRating: number }[] {
    if (asOverPower) {
        return [
            { score: borderScoreMap[Rank.Max] + 1, integerRating: integerBaseRating + 275 },
            { score: borderScoreMap[Rank.Max], integerRating: integerBaseRating + 275 },
            { score: borderScoreMap[Rank.SSS], integerRating: integerBaseRating + 200 },
            { score: borderScoreMap[Rank.SSA], integerRating: integerBaseRating + 150 },
            { score: borderScoreMap[Rank.SS], integerRating: integerBaseRating + 100 },
            { score: borderScoreMap[Rank.S], integerRating: integerBaseRating },
            { score: borderScoreMap[Rank.AA], integerRating: Math.max(integerBaseRating - 300, 0) },
            { score: borderScoreMap[Rank.A], integerRating: Math.max(integerBaseRating - 500, 0) },
            { score: borderScoreMap[Rank.BBB], integerRating: Math.max((integerBaseRating - 500) / 2.0, 0) },
            { score: borderScoreMap[Rank.C], integerRating: 0 },
            { score: borderScoreMap[Rank.D], integerRating: 0 },
        ];
    }
    else {
        return [
            { score: borderScoreMap[Rank.SSS] + 1, integerRating: integerBaseRating + 200 },
            { score: borderScoreMap[Rank.SSS], integerRating: integerBaseRating + 200 },
            { score: borderScoreMap[Rank.SSA], integerRating: integerBaseRating + 150 },
            { score: borderScoreMap[Rank.SS], integerRating: integerBaseRating + 100 },
            { score: borderScoreMap[Rank.S], integerRating: integerBaseRating },
            { score: borderScoreMap[Rank.AA], integerRating: Math.max(integerBaseRating - 300, 0) },
            { score: borderScoreMap[Rank.A], integerRating: Math.max(integerBaseRating - 500, 0) },
            { score: borderScoreMap[Rank.BBB], integerRating: Math.max((integerBaseRating - 500) / 2.0, 0) },
            { score: borderScoreMap[Rank.C], integerRating: 0 },
            { score: borderScoreMap[Rank.D], integerRating: 0 },
        ];
    }
}

function getIntegerPlayRating(baseRating: number, score: number, asOverPower = false): number {
    if (baseRating <= 0 || score <= 0) {
        return 0;
    }

    const integerBaseRating = convertToIntegerRating(baseRating);
    const borders = getBordersAsIntegerRating(integerBaseRating, asOverPower);

    for (let i = 1; i < borders.length; i++) {
        const nextBorder = borders[i - 1];
        const border = borders[i];
        if (score >= border.score) {
            const diffScore = score - border.score;
            const diffBorderScore = nextBorder.score - border.score;
            const diffBorderIntegerRating = nextBorder.integerRating - border.integerRating;
            const integerPlayRating = (diffScore * diffBorderIntegerRating + diffBorderScore * border.integerRating) / diffBorderScore;
            return integerPlayRating;
        }
    }

    return 0;
}

function getRating(baseRating: number, score: number): number {
    return Math.floor(getIntegerPlayRating(baseRating, score)) / 100;
}

function getOverPower(baseRating: number, score: number, comboStatus: ComboStatus): number {
    const integerPlayRating = getIntegerPlayRating(baseRating, score, true);
    if (integerPlayRating <= 0) {
        return 0;
    }

    let basePoint = integerPlayRating;
    if (score >= borderScoreMap[Rank.Max]) {
        basePoint += 25;
    }
    else {
        switch (comboStatus) {
            case ComboStatus.AllJustice:
                basePoint += 20;
                break;
            case ComboStatus.FullCombo:
                basePoint += 10;
                break;
        }
    }

    let overPower = basePoint * 5;
    if (score < borderScoreMap[Rank.S]) {
        overPower = Math.floor(overPower) / 100;
    }
    else {
        overPower = overPower / 100;
    }

    return overPower;
}

function calcBaseRating(beforeOp: number, afterOp: number, score: number, comboStatus: ComboStatus): number {
    if (score < borderScoreMap[Rank.AA] || score > borderScoreMap[Rank.Max]) {
        return 0;
    }

    if (beforeOp > afterOp) {
        return 0;
    }

    const diffOp = afterOp - beforeOp;
    let added = 0;
    if (score >= borderScoreMap[Rank.Max]) {
        added = 2.75;
    }
    else if (score >= borderScoreMap[Rank.SSS]) {
        added = 2.0 + 0.75 * (score - borderScoreMap[Rank.SSS]) / (borderScoreMap[Rank.Max] - borderScoreMap[Rank.SSS]);
    }
    else if (score >= borderScoreMap[Rank.SSA]) {
        added = 1.5 + 0.5 * (score - borderScoreMap[Rank.SSA]) / (borderScoreMap[Rank.SSS] - borderScoreMap[Rank.SSA]);
    }
    else if (score >= borderScoreMap[Rank.SS]) {
        added = 1.0 + 0.5 * (score - borderScoreMap[Rank.SS]) / (borderScoreMap[Rank.SSA] - borderScoreMap[Rank.SS]);
    }
    else if (score >= borderScoreMap[Rank.S]) {
        added = 1.0 * (score - borderScoreMap[Rank.S]) / (borderScoreMap[Rank.SS] - borderScoreMap[Rank.S]);
    }
    else if (score >= borderScoreMap[Rank.AA]) {
        added = -3.0 + 3.0 * (score - borderScoreMap[Rank.AA]) / (borderScoreMap[Rank.S] - borderScoreMap[Rank.AA]);
    }
    switch (comboStatus) {
        case ComboStatus.AllJustice:
            if (score >= borderScoreMap[Rank.Max]) {
                added += 0.25;
            } else {
                added += 0.2;
            }
            break;
        case ComboStatus.FullCombo:
            added += 0.1;
            break;
    }

    const baseRating = score >= borderScoreMap[Rank.S]
        ? Math.round((diffOp / 5 - added) * 100) / 100
        : Math.round((diffOp / 5 - added) * 10) / 10
    return baseRating;
}

export class Rating {
    public static getBorderScore(rank: Rank): number {
        return getBorderScore(rank);
    }

    public static getBorderBaseRating(levelText: string): number {
        return getBorderBaseRating(levelText);
    }

    public static getRating(baseRating: number, score: number): number {
        return getRating(baseRating, score);
    }

    public static getOverPower(baseRating: number, score: number, comboStatus: ComboStatus): number {
        return getOverPower(baseRating, score, comboStatus);
    }

    public static calcBaseRating(beforeOp: number, afterOp: number, score: number, comboStatus: ComboStatus): number {
        return calcBaseRating(beforeOp, afterOp, score, comboStatus);
    }
}
