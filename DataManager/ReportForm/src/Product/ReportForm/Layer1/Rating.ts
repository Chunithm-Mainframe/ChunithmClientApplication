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
    SS,
    SSA,
    SSS,
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

const RANK_MAX_BORDER_SCORE = 1010000;
const RANK_SSS_BORDER_SCORE = 1007500;
const RANK_SSA_BORDER_SCORE = 1005000;
const RANK_SS_BORDER_SCORE = 1000000;
const RANK_S_BORDER_SCORE = 975000;
const RANK_AAA_BORDER_SCORE = 950000;
const RANK_AA_BORDER_SCORE = 925000;
const RANK_A_BORDER_SCORE = 900000;
const RANK_BBB_BORDER_SCORE = 800000;
const RANK_BB_BORDER_SCORE = 700000;
const RANK_B_BORDER_SCORE = 600000;
const RANK_C_BORDER_SCORE = 500000;
const RANK_D_BORDER_SCORE = 0;
const RANK_NONE_BORDER_SCORE = 0;

export function getBorderScore(rank: Rank): number {
    switch (rank) {
        case Rank.Max:
            return RANK_MAX_BORDER_SCORE;
        case Rank.SSS:
            return RANK_SSS_BORDER_SCORE;
        case Rank.SSA:
            return RANK_SSA_BORDER_SCORE;
        case Rank.SS:
            return RANK_SS_BORDER_SCORE;
        case Rank.S:
            return RANK_S_BORDER_SCORE;
        case Rank.AAA:
            return RANK_AAA_BORDER_SCORE;
        case Rank.AA:
            return RANK_AA_BORDER_SCORE;
        case Rank.A:
            return RANK_A_BORDER_SCORE;
        case Rank.BBB:
            return RANK_BBB_BORDER_SCORE;
        case Rank.BB:
            return RANK_BB_BORDER_SCORE;
        case Rank.B:
            return RANK_B_BORDER_SCORE;
        case Rank.C:
            return RANK_C_BORDER_SCORE;
        case Rank.D:
            return RANK_D_BORDER_SCORE;
    }
    return RANK_NONE_BORDER_SCORE;
}

export function getBorderBaseRating(levelText: string): number {
    let integer = 0;
    let decimal = 0;

    if (levelText.indexOf("+") !== -1) {
        decimal = 0.7;
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
            { score: RANK_MAX_BORDER_SCORE + 1, integerRating: integerBaseRating + 275 },
            { score: RANK_MAX_BORDER_SCORE, integerRating: integerBaseRating + 275 },
            { score: RANK_SSS_BORDER_SCORE, integerRating: integerBaseRating + 200 },
            { score: RANK_SSA_BORDER_SCORE, integerRating: integerBaseRating + 150 },
            { score: RANK_SS_BORDER_SCORE, integerRating: integerBaseRating + 100 },
            { score: RANK_S_BORDER_SCORE, integerRating: integerBaseRating },
            { score: RANK_AA_BORDER_SCORE, integerRating: Math.max(integerBaseRating - 300, 0) },
            { score: RANK_A_BORDER_SCORE, integerRating: Math.max(integerBaseRating - 500, 0) },
            { score: RANK_BBB_BORDER_SCORE, integerRating: Math.max((integerBaseRating - 500) / 2.0, 0) },
            { score: RANK_C_BORDER_SCORE, integerRating: 0 },
            { score: RANK_D_BORDER_SCORE, integerRating: 0 },
        ];
    }
    else {
        return [
            { score: RANK_SSS_BORDER_SCORE + 1, integerRating: integerBaseRating + 200 },
            { score: RANK_SSS_BORDER_SCORE, integerRating: integerBaseRating + 200 },
            { score: RANK_SSA_BORDER_SCORE, integerRating: integerBaseRating + 150 },
            { score: RANK_SS_BORDER_SCORE, integerRating: integerBaseRating + 100 },
            { score: RANK_S_BORDER_SCORE, integerRating: integerBaseRating },
            { score: RANK_AA_BORDER_SCORE, integerRating: Math.max(integerBaseRating - 300, 0) },
            { score: RANK_A_BORDER_SCORE, integerRating: Math.max(integerBaseRating - 500, 0) },
            { score: RANK_BBB_BORDER_SCORE, integerRating: Math.max((integerBaseRating - 500) / 2.0, 0) },
            { score: RANK_C_BORDER_SCORE, integerRating: 0 },
            { score: RANK_D_BORDER_SCORE, integerRating: 0 },
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

export function getRating(baseRating: number, score: number): number {
    return Math.floor(getIntegerPlayRating(baseRating, score)) / 100;
}

export function getOverPower(baseRating: number, score: number, comboStatus: ComboStatus): number {
    const integerPlayRating = getIntegerPlayRating(baseRating, score, true);
    if (integerPlayRating <= 0) {
        return 0;
    }

    let basePoint = integerPlayRating;
    if (score >= RANK_MAX_BORDER_SCORE) {
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
    if (score < RANK_S_BORDER_SCORE) {
        overPower = Math.floor(overPower) / 100;
    }
    else {
        overPower = overPower / 100;
    }

    return overPower;
}

export function calcBaseRating(beforeOp: number, afterOp: number, score: number, comboStatus: ComboStatus): number {
    if (score < RANK_AA_BORDER_SCORE || score > RANK_MAX_BORDER_SCORE) {
        return 0;
    }

    if (beforeOp > afterOp) {
        return 0;
    }

    const diffOp = afterOp - beforeOp;
    let added = 0;
    if (score >= RANK_MAX_BORDER_SCORE) {
        added = 2.75;
    }
    else if (score >= RANK_SSS_BORDER_SCORE) {
        added = 2.0 + 0.75 * (score - RANK_SSS_BORDER_SCORE) / (RANK_MAX_BORDER_SCORE - RANK_SSS_BORDER_SCORE);
    }
    else if (score >= RANK_SSA_BORDER_SCORE) {
        added = 1.5 + 0.5 * (score - RANK_SSA_BORDER_SCORE) / (RANK_SSS_BORDER_SCORE - RANK_SSA_BORDER_SCORE);
    }
    else if (score >= RANK_SS_BORDER_SCORE) {
        added = 1.0 + 0.5 * (score - RANK_SS_BORDER_SCORE) / (RANK_SSA_BORDER_SCORE - RANK_SS_BORDER_SCORE);
    }
    else if (score >= RANK_S_BORDER_SCORE) {
        added = 1.0 * (score - RANK_S_BORDER_SCORE) / (RANK_SS_BORDER_SCORE - RANK_S_BORDER_SCORE);
    }
    else if (score >= RANK_AA_BORDER_SCORE) {
        added = -3.0 + 3.0 * (score - RANK_AA_BORDER_SCORE) / (RANK_S_BORDER_SCORE - RANK_AA_BORDER_SCORE);
    }
    switch (comboStatus) {
        case ComboStatus.AllJustice:
            if (score >= RANK_MAX_BORDER_SCORE) {
                added += 0.25;
            } else {
                added += 0.2;
            }
            break;
        case ComboStatus.FullCombo:
            added += 0.1;
            break;
    }

    const baseRating = score >= RANK_S_BORDER_SCORE
        ? Math.round((diffOp / 5 - added) * 100) / 100
        : Math.round((diffOp / 5 - added) * 10) / 10
    return baseRating;
}
