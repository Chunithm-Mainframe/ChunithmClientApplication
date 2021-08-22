import { calcBaseRating, ComboStatus, getBorderScore, getOverPower, getRating, Rank } from "../src/Product/ReportForm/Layer1/Rating";

function checkCommon(expectedRating: number, baseRating: number, score: number): void {
    const actualRating = getRating(baseRating, score);
    expect(expectedRating).toBe(actualRating);
}

function checkBorder(expectedRating: number, baseRating: number, rank: Rank): void {
    checkCommon(expectedRating, baseRating, getBorderScore(rank));
}

function checkMedian(expectedRating: number, baseRating: number, rank1: Rank, rank2: Rank) {
    const score = (getBorderScore(rank1) + getBorderScore(rank2)) / 2;
    checkCommon(expectedRating, baseRating, score);
}

function checkJustBeforeBorder(expectedRating: number, baseRating: number, rank: Rank) {
    checkCommon(expectedRating, baseRating, getBorderScore(rank) - 1);
}

function checkJustBeforeMedian(expectedRating: number, baseRating: number, rank1: Rank, rank2: Rank) {
    const score = (getBorderScore(rank1) + getBorderScore(rank2)) / 2 - 1;
    checkCommon(expectedRating, baseRating, score);
}

function checkOutOfRange(expectedRating: number, baseRating: number, score: number) {
    checkCommon(expectedRating, baseRating, score);
}

describe("rating", () => {
    it("ボーダーチェック", () => {
        checkBorder(0, 3, Rank.AA);
        checkBorder(3, 3, Rank.S);
        checkBorder(4, 3, Rank.SS);
        checkBorder(4.5, 3, Rank.SSA);
        checkBorder(5, 3, Rank.SSS);

        checkBorder(0, 5, Rank.A);
        checkBorder(2, 5, Rank.AA);
        checkBorder(5, 5, Rank.S);
        checkBorder(6, 5, Rank.SS);
        checkBorder(6.5, 5, Rank.SSA);
        checkBorder(7, 5, Rank.SSS);

        checkBorder(0, 13.0, Rank.C);
        checkBorder(4, 13.0, Rank.BBB);
        checkBorder(8, 13.0, Rank.A);
        checkBorder(10, 13.0, Rank.AA);
        checkBorder(13, 13.0, Rank.S);
        checkBorder(14, 13.0, Rank.SS);
        checkBorder(14.5, 13.0, Rank.SSA);
        checkBorder(15, 13.0, Rank.SSS);

        checkBorder(0.0, 13.1, Rank.C);
        checkBorder(4.05, 13.1, Rank.BBB);
        checkBorder(8.1, 13.1, Rank.A);
        checkBorder(10.1, 13.1, Rank.AA);
        checkBorder(13.1, 13.1, Rank.S);
        checkBorder(14.1, 13.1, Rank.SS);
        checkBorder(14.6, 13.1, Rank.SSA);
        checkBorder(15.1, 13.1, Rank.SSS);

        checkBorder(0.0, 13.2, Rank.C);
        checkBorder(4.1, 13.2, Rank.BBB);
        checkBorder(8.2, 13.2, Rank.A);
        checkBorder(10.2, 13.2, Rank.AA);
        checkBorder(13.2, 13.2, Rank.S);
        checkBorder(14.2, 13.2, Rank.SS);
        checkBorder(14.7, 13.2, Rank.SSA);
        checkBorder(15.2, 13.2, Rank.SSS);

        checkBorder(0.0, 13.3, Rank.C);
        checkBorder(4.15, 13.3, Rank.BBB);
        checkBorder(8.3, 13.3, Rank.A);
        checkBorder(10.3, 13.3, Rank.AA);
        checkBorder(13.3, 13.3, Rank.S);
        checkBorder(14.3, 13.3, Rank.SS);
        checkBorder(14.8, 13.3, Rank.SSA);
        checkBorder(15.3, 13.3, Rank.SSS);

        checkBorder(0.0, 13.4, Rank.C);
        checkBorder(4.2, 13.4, Rank.BBB);
        checkBorder(8.4, 13.4, Rank.A);
        checkBorder(10.4, 13.4, Rank.AA);
        checkBorder(13.4, 13.4, Rank.S);
        checkBorder(14.4, 13.4, Rank.SS);
        checkBorder(14.9, 13.4, Rank.SSA);
        checkBorder(15.4, 13.4, Rank.SSS);

        checkBorder(0.0, 13.5, Rank.C);
        checkBorder(4.25, 13.5, Rank.BBB);
        checkBorder(8.5, 13.5, Rank.A);
        checkBorder(10.5, 13.5, Rank.AA);
        checkBorder(13.5, 13.5, Rank.S);
        checkBorder(14.5, 13.5, Rank.SS);
        checkBorder(15.0, 13.5, Rank.SSA);
        checkBorder(15.5, 13.5, Rank.SSS);

        checkBorder(0.0, 13.6, Rank.C);
        checkBorder(4.3, 13.6, Rank.BBB);
        checkBorder(8.6, 13.6, Rank.A);
        checkBorder(10.6, 13.6, Rank.AA);
        checkBorder(13.6, 13.6, Rank.S);
        checkBorder(14.6, 13.6, Rank.SS);
        checkBorder(15.1, 13.6, Rank.SSA);
        checkBorder(15.6, 13.6, Rank.SSS);

        checkBorder(0.0, 13.7, Rank.C);
        checkBorder(4.35, 13.7, Rank.BBB);
        checkBorder(8.7, 13.7, Rank.A);
        checkBorder(10.7, 13.7, Rank.AA);
        checkBorder(13.7, 13.7, Rank.S);
        checkBorder(14.7, 13.7, Rank.SS);
        checkBorder(15.2, 13.7, Rank.SSA);
        checkBorder(15.7, 13.7, Rank.SSS);

        checkBorder(0.0, 13.8, Rank.C);
        checkBorder(4.4, 13.8, Rank.BBB);
        checkBorder(8.8, 13.8, Rank.A);
        checkBorder(10.8, 13.8, Rank.AA);
        checkBorder(13.8, 13.8, Rank.S);
        checkBorder(14.8, 13.8, Rank.SS);
        checkBorder(15.3, 13.8, Rank.SSA);
        checkBorder(15.8, 13.8, Rank.SSS);

        checkBorder(0.0, 13.9, Rank.C);
        checkBorder(4.45, 13.9, Rank.BBB);
        checkBorder(8.9, 13.9, Rank.A);
        checkBorder(10.9, 13.9, Rank.AA);
        checkBorder(13.9, 13.9, Rank.S);
        checkBorder(14.9, 13.9, Rank.SS);
        checkBorder(15.4, 13.9, Rank.SSA);
        checkBorder(15.9, 13.9, Rank.SSS);

        checkBorder(0.0, 14.0, Rank.C);
        checkBorder(4.5, 14.0, Rank.BBB);
        checkBorder(9.0, 14.0, Rank.A);
        checkBorder(11.0, 14.0, Rank.AA);
        checkBorder(14.0, 14.0, Rank.S);
        checkBorder(15.0, 14.0, Rank.SS);
        checkBorder(15.5, 14.0, Rank.SSA);
        checkBorder(16.0, 14.0, Rank.SSS);
    });

    it("中間値チェック", () => {
        checkMedian(1.5, 3, Rank.AA, Rank.S);
        checkMedian(3.5, 3, Rank.S, Rank.SS);
        checkMedian(4.25, 3, Rank.SS, Rank.SSA);
        checkMedian(4.75, 3, Rank.SSA, Rank.SSS);

        checkMedian(1, 5, Rank.A, Rank.AA);
        checkMedian(3.5, 5, Rank.AA, Rank.S);
        checkMedian(5.5, 5, Rank.S, Rank.SS);
        checkMedian(6.25, 5, Rank.SS, Rank.SSA);
        checkMedian(6.75, 5, Rank.SSA, Rank.SSS);

        checkMedian(0.25, 6, Rank.C, Rank.BBB);
        checkMedian(0.75, 6, Rank.BBB, Rank.A);
        checkMedian(2, 6, Rank.A, Rank.AA);
        checkMedian(4.5, 6, Rank.AA, Rank.S);
        checkMedian(6.5, 6, Rank.S, Rank.SS);
        checkMedian(7.25, 6, Rank.SS, Rank.SSA);
        checkMedian(7.75, 6, Rank.SSA, Rank.SSS);

        checkMedian(2.00, 13.0, Rank.C, Rank.BBB);
        checkMedian(6.00, 13.0, Rank.BBB, Rank.A);
        checkMedian(9.00, 13.0, Rank.A, Rank.AA);
        checkMedian(11.50, 13.0, Rank.AA, Rank.S);
        checkMedian(13.50, 13.0, Rank.S, Rank.SS);
        checkMedian(14.25, 13.0, Rank.SS, Rank.SSA);
        checkMedian(14.75, 13.0, Rank.SSA, Rank.SSS);

        checkMedian(2.02, 13.1, Rank.C, Rank.BBB);
        checkMedian(6.07, 13.1, Rank.BBB, Rank.A);
        checkMedian(9.10, 13.1, Rank.A, Rank.AA);
        checkMedian(11.60, 13.1, Rank.AA, Rank.S);
        checkMedian(13.60, 13.1, Rank.S, Rank.SS);
        checkMedian(14.35, 13.1, Rank.SS, Rank.SSA);
        checkMedian(14.85, 13.1, Rank.SSA, Rank.SSS);

        checkMedian(2.05, 13.2, Rank.C, Rank.BBB);
        checkMedian(6.15, 13.2, Rank.BBB, Rank.A);
        checkMedian(9.20, 13.2, Rank.A, Rank.AA);
        checkMedian(11.70, 13.2, Rank.AA, Rank.S);
        checkMedian(13.70, 13.2, Rank.S, Rank.SS);
        checkMedian(14.45, 13.2, Rank.SS, Rank.SSA);
        checkMedian(14.95, 13.2, Rank.SSA, Rank.SSS);

        checkMedian(2.07, 13.3, Rank.C, Rank.BBB);
        checkMedian(6.22, 13.3, Rank.BBB, Rank.A);
        checkMedian(9.30, 13.3, Rank.A, Rank.AA);
        checkMedian(11.80, 13.3, Rank.AA, Rank.S);
        checkMedian(13.80, 13.3, Rank.S, Rank.SS);
        checkMedian(14.55, 13.3, Rank.SS, Rank.SSA);
        checkMedian(15.05, 13.3, Rank.SSA, Rank.SSS);

        checkMedian(2.10, 13.4, Rank.C, Rank.BBB);
        checkMedian(6.30, 13.4, Rank.BBB, Rank.A);
        checkMedian(9.40, 13.4, Rank.A, Rank.AA);
        checkMedian(11.90, 13.4, Rank.AA, Rank.S);
        checkMedian(13.90, 13.4, Rank.S, Rank.SS);
        checkMedian(14.65, 13.4, Rank.SS, Rank.SSA);
        checkMedian(15.15, 13.4, Rank.SSA, Rank.SSS);

        checkMedian(2.12, 13.5, Rank.C, Rank.BBB);
        checkMedian(6.37, 13.5, Rank.BBB, Rank.A);
        checkMedian(9.50, 13.5, Rank.A, Rank.AA);
        checkMedian(12.00, 13.5, Rank.AA, Rank.S);
        checkMedian(14.00, 13.5, Rank.S, Rank.SS);
        checkMedian(14.75, 13.5, Rank.SS, Rank.SSA);
        checkMedian(15.25, 13.5, Rank.SSA, Rank.SSS);

        checkMedian(2.15, 13.6, Rank.C, Rank.BBB);
        checkMedian(6.45, 13.6, Rank.BBB, Rank.A);
        checkMedian(9.60, 13.6, Rank.A, Rank.AA);
        checkMedian(12.10, 13.6, Rank.AA, Rank.S);
        checkMedian(14.10, 13.6, Rank.S, Rank.SS);
        checkMedian(14.85, 13.6, Rank.SS, Rank.SSA);
        checkMedian(15.35, 13.6, Rank.SSA, Rank.SSS);

        checkMedian(2.17, 13.7, Rank.C, Rank.BBB);
        checkMedian(6.52, 13.7, Rank.BBB, Rank.A);
        checkMedian(9.70, 13.7, Rank.A, Rank.AA);
        checkMedian(12.20, 13.7, Rank.AA, Rank.S);
        checkMedian(14.20, 13.7, Rank.S, Rank.SS);
        checkMedian(14.95, 13.7, Rank.SS, Rank.SSA);
        checkMedian(15.45, 13.7, Rank.SSA, Rank.SSS);

        checkMedian(2.20, 13.8, Rank.C, Rank.BBB);
        checkMedian(6.60, 13.8, Rank.BBB, Rank.A);
        checkMedian(9.80, 13.8, Rank.A, Rank.AA);
        checkMedian(12.30, 13.8, Rank.AA, Rank.S);
        checkMedian(14.30, 13.8, Rank.S, Rank.SS);
        checkMedian(15.05, 13.8, Rank.SS, Rank.SSA);
        checkMedian(15.55, 13.8, Rank.SSA, Rank.SSS);

        checkMedian(2.22, 13.9, Rank.C, Rank.BBB);
        checkMedian(6.67, 13.9, Rank.BBB, Rank.A);
        checkMedian(9.90, 13.9, Rank.A, Rank.AA);
        checkMedian(12.40, 13.9, Rank.AA, Rank.S);
        checkMedian(14.40, 13.9, Rank.S, Rank.SS);
        checkMedian(15.15, 13.9, Rank.SS, Rank.SSA);
        checkMedian(15.65, 13.9, Rank.SSA, Rank.SSS);

        checkMedian(2.25, 14.0, Rank.C, Rank.BBB);
        checkMedian(6.75, 14.0, Rank.BBB, Rank.A);
        checkMedian(10.00, 14.0, Rank.A, Rank.AA);
        checkMedian(12.50, 14.0, Rank.AA, Rank.S);
        checkMedian(14.50, 14.0, Rank.S, Rank.SS);
        checkMedian(15.25, 14.0, Rank.SS, Rank.SSA);
        checkMedian(15.75, 14.0, Rank.SSA, Rank.SSS);
    });

    it("ボーダー境界チェック", () => {
        checkJustBeforeBorder(0, 3, Rank.AA);
        checkJustBeforeBorder(2.99, 3, Rank.S);
        checkJustBeforeBorder(3.99, 3, Rank.SS);
        checkJustBeforeBorder(4.49, 3, Rank.SSA);
        checkJustBeforeBorder(4.99, 3, Rank.SSS);

        checkJustBeforeBorder(0, 5, Rank.A);
        checkJustBeforeBorder(1.99, 5, Rank.AA);
        checkJustBeforeBorder(4.99, 5, Rank.S);
        checkJustBeforeBorder(5.99, 5, Rank.SS);
        checkJustBeforeBorder(6.49, 5, Rank.SSA);
        checkJustBeforeBorder(6.99, 5, Rank.SSS);

        checkJustBeforeBorder(0, 13.0, Rank.C);
        checkJustBeforeBorder(3.99, 13.0, Rank.BBB);
        checkJustBeforeBorder(7.99, 13.0, Rank.A);
        checkJustBeforeBorder(9.99, 13.0, Rank.AA);
        checkJustBeforeBorder(12.99, 13.0, Rank.S);
        checkJustBeforeBorder(13.99, 13.0, Rank.SS);
        checkJustBeforeBorder(14.49, 13.0, Rank.SSA);
        checkJustBeforeBorder(14.99, 13.0, Rank.SSS);

        checkJustBeforeBorder(0, 13.1, Rank.C);
        checkJustBeforeBorder(4.04, 13.1, Rank.BBB);
        checkJustBeforeBorder(8.09, 13.1, Rank.A);
        checkJustBeforeBorder(10.09, 13.1, Rank.AA);
        checkJustBeforeBorder(13.09, 13.1, Rank.S);
        checkJustBeforeBorder(14.09, 13.1, Rank.SS);
        checkJustBeforeBorder(14.59, 13.1, Rank.SSA);
        checkJustBeforeBorder(15.09, 13.1, Rank.SSS);

        checkJustBeforeBorder(0, 13.2, Rank.C);
        checkJustBeforeBorder(4.09, 13.2, Rank.BBB);
        checkJustBeforeBorder(8.19, 13.2, Rank.A);
        checkJustBeforeBorder(10.19, 13.2, Rank.AA);
        checkJustBeforeBorder(13.19, 13.2, Rank.S);
        checkJustBeforeBorder(14.19, 13.2, Rank.SS);
        checkJustBeforeBorder(14.69, 13.2, Rank.SSA);
        checkJustBeforeBorder(15.19, 13.2, Rank.SSS);

        checkJustBeforeBorder(0, 13.3, Rank.C);
        checkJustBeforeBorder(4.14, 13.3, Rank.BBB);
        checkJustBeforeBorder(8.29, 13.3, Rank.A);
        checkJustBeforeBorder(10.29, 13.3, Rank.AA);
        checkJustBeforeBorder(13.29, 13.3, Rank.S);
        checkJustBeforeBorder(14.29, 13.3, Rank.SS);
        checkJustBeforeBorder(14.79, 13.3, Rank.SSA);
        checkJustBeforeBorder(15.29, 13.3, Rank.SSS);

        checkJustBeforeBorder(0, 13.4, Rank.C);
        checkJustBeforeBorder(4.19, 13.4, Rank.BBB);
        checkJustBeforeBorder(8.39, 13.4, Rank.A);
        checkJustBeforeBorder(10.39, 13.4, Rank.AA);
        checkJustBeforeBorder(13.39, 13.4, Rank.S);
        checkJustBeforeBorder(14.39, 13.4, Rank.SS);
        checkJustBeforeBorder(14.89, 13.4, Rank.SSA);
        checkJustBeforeBorder(15.39, 13.4, Rank.SSS);

        checkJustBeforeBorder(0, 13.5, Rank.C);
        checkJustBeforeBorder(4.24, 13.5, Rank.BBB);
        checkJustBeforeBorder(8.49, 13.5, Rank.A);
        checkJustBeforeBorder(10.49, 13.5, Rank.AA);
        checkJustBeforeBorder(13.49, 13.5, Rank.S);
        checkJustBeforeBorder(14.49, 13.5, Rank.SS);
        checkJustBeforeBorder(14.99, 13.5, Rank.SSA);
        checkJustBeforeBorder(15.49, 13.5, Rank.SSS);

        checkJustBeforeBorder(0, 13.6, Rank.C);
        checkJustBeforeBorder(4.29, 13.6, Rank.BBB);
        checkJustBeforeBorder(8.59, 13.6, Rank.A);
        checkJustBeforeBorder(10.59, 13.6, Rank.AA);
        checkJustBeforeBorder(13.59, 13.6, Rank.S);
        checkJustBeforeBorder(14.59, 13.6, Rank.SS);
        checkJustBeforeBorder(15.09, 13.6, Rank.SSA);
        checkJustBeforeBorder(15.59, 13.6, Rank.SSS);

        checkJustBeforeBorder(0, 13.7, Rank.C);
        checkJustBeforeBorder(4.34, 13.7, Rank.BBB);
        checkJustBeforeBorder(8.69, 13.7, Rank.A);
        checkJustBeforeBorder(10.69, 13.7, Rank.AA);
        checkJustBeforeBorder(13.69, 13.7, Rank.S);
        checkJustBeforeBorder(14.69, 13.7, Rank.SS);
        checkJustBeforeBorder(15.19, 13.7, Rank.SSA);
        checkJustBeforeBorder(15.69, 13.7, Rank.SSS);

        checkJustBeforeBorder(0, 13.8, Rank.C);
        checkJustBeforeBorder(4.39, 13.8, Rank.BBB);
        checkJustBeforeBorder(8.79, 13.8, Rank.A);
        checkJustBeforeBorder(10.79, 13.8, Rank.AA);
        checkJustBeforeBorder(13.79, 13.8, Rank.S);
        checkJustBeforeBorder(14.79, 13.8, Rank.SS);
        checkJustBeforeBorder(15.29, 13.8, Rank.SSA);
        checkJustBeforeBorder(15.79, 13.8, Rank.SSS);

        checkJustBeforeBorder(0, 13.9, Rank.C);
        checkJustBeforeBorder(4.44, 13.9, Rank.BBB);
        checkJustBeforeBorder(8.89, 13.9, Rank.A);
        checkJustBeforeBorder(10.89, 13.9, Rank.AA);
        checkJustBeforeBorder(13.89, 13.9, Rank.S);
        checkJustBeforeBorder(14.89, 13.9, Rank.SS);
        checkJustBeforeBorder(15.39, 13.9, Rank.SSA);
        checkJustBeforeBorder(15.89, 13.9, Rank.SSS);

        checkJustBeforeBorder(0, 14.0, Rank.C);
        checkJustBeforeBorder(4.49, 14.0, Rank.BBB);
        checkJustBeforeBorder(8.99, 14.0, Rank.A);
        checkJustBeforeBorder(10.99, 14.0, Rank.AA);
        checkJustBeforeBorder(13.99, 14.0, Rank.S);
        checkJustBeforeBorder(14.99, 14.0, Rank.SS);
        checkJustBeforeBorder(15.49, 14.0, Rank.SSA);
        checkJustBeforeBorder(15.99, 14.0, Rank.SSS);
    });

    it("中間値境界チェック", () => {
        checkJustBeforeMedian(1.49, 3, Rank.AA, Rank.S);
        checkJustBeforeMedian(3.49, 3, Rank.S, Rank.SS);
        checkJustBeforeMedian(4.24, 3, Rank.SS, Rank.SSA);
        checkJustBeforeMedian(4.74, 3, Rank.SSA, Rank.SSS);

        checkJustBeforeMedian(0.99, 5, Rank.A, Rank.AA);
        checkJustBeforeMedian(3.49, 5, Rank.AA, Rank.S);
        checkJustBeforeMedian(5.49, 5, Rank.S, Rank.SS);
        checkJustBeforeMedian(6.24, 5, Rank.SS, Rank.SSA);
        checkJustBeforeMedian(6.74, 5, Rank.SSA, Rank.SSS);

        checkJustBeforeMedian(0.24, 6, Rank.C, Rank.BBB);
        checkJustBeforeMedian(0.74, 6, Rank.BBB, Rank.A);
        checkJustBeforeMedian(1.99, 6, Rank.A, Rank.AA);
        checkJustBeforeMedian(4.49, 6, Rank.AA, Rank.S);
        checkJustBeforeMedian(6.49, 6, Rank.S, Rank.SS);
        checkJustBeforeMedian(7.24, 6, Rank.SS, Rank.SSA);
        checkJustBeforeMedian(7.74, 6, Rank.SSA, Rank.SSS);

        checkJustBeforeMedian(1.99, 13.0, Rank.C, Rank.BBB);
        checkJustBeforeMedian(5.99, 13.0, Rank.BBB, Rank.A);
        checkJustBeforeMedian(8.99, 13.0, Rank.A, Rank.AA);
        checkJustBeforeMedian(11.49, 13.0, Rank.AA, Rank.S);
        checkJustBeforeMedian(13.49, 13.0, Rank.S, Rank.SS);
        checkJustBeforeMedian(14.24, 13.0, Rank.SS, Rank.SSA);
        checkJustBeforeMedian(14.74, 13.0, Rank.SSA, Rank.SSS);

        checkJustBeforeMedian(2.02, 13.1, Rank.C, Rank.BBB);
        checkJustBeforeMedian(6.07, 13.1, Rank.BBB, Rank.A);
        checkJustBeforeMedian(9.09, 13.1, Rank.A, Rank.AA);
        checkJustBeforeMedian(11.59, 13.1, Rank.AA, Rank.S);
        checkJustBeforeMedian(13.59, 13.1, Rank.S, Rank.SS);
        checkJustBeforeMedian(14.34, 13.1, Rank.SS, Rank.SSA);
        checkJustBeforeMedian(14.84, 13.1, Rank.SSA, Rank.SSS);

        checkJustBeforeMedian(2.04, 13.2, Rank.C, Rank.BBB);
        checkJustBeforeMedian(6.14, 13.2, Rank.BBB, Rank.A);
        checkJustBeforeMedian(9.19, 13.2, Rank.A, Rank.AA);
        checkJustBeforeMedian(11.69, 13.2, Rank.AA, Rank.S);
        checkJustBeforeMedian(13.69, 13.2, Rank.S, Rank.SS);
        checkJustBeforeMedian(14.44, 13.2, Rank.SS, Rank.SSA);
        checkJustBeforeMedian(14.94, 13.2, Rank.SSA, Rank.SSS);

        checkJustBeforeMedian(2.07, 13.3, Rank.C, Rank.BBB);
        checkJustBeforeMedian(6.22, 13.3, Rank.BBB, Rank.A);
        checkJustBeforeMedian(9.29, 13.3, Rank.A, Rank.AA);
        checkJustBeforeMedian(11.79, 13.3, Rank.AA, Rank.S);
        checkJustBeforeMedian(13.79, 13.3, Rank.S, Rank.SS);
        checkJustBeforeMedian(14.54, 13.3, Rank.SS, Rank.SSA);
        checkJustBeforeMedian(15.04, 13.3, Rank.SSA, Rank.SSS);

        checkJustBeforeMedian(2.09, 13.4, Rank.C, Rank.BBB);
        checkJustBeforeMedian(6.29, 13.4, Rank.BBB, Rank.A);
        checkJustBeforeMedian(9.39, 13.4, Rank.A, Rank.AA);
        checkJustBeforeMedian(11.89, 13.4, Rank.AA, Rank.S);
        checkJustBeforeMedian(13.89, 13.4, Rank.S, Rank.SS);
        checkJustBeforeMedian(14.64, 13.4, Rank.SS, Rank.SSA);
        checkJustBeforeMedian(15.14, 13.4, Rank.SSA, Rank.SSS);

        checkJustBeforeMedian(2.12, 13.5, Rank.C, Rank.BBB);
        checkJustBeforeMedian(6.37, 13.5, Rank.BBB, Rank.A);
        checkJustBeforeMedian(9.49, 13.5, Rank.A, Rank.AA);
        checkJustBeforeMedian(11.99, 13.5, Rank.AA, Rank.S);
        checkJustBeforeMedian(13.99, 13.5, Rank.S, Rank.SS);
        checkJustBeforeMedian(14.74, 13.5, Rank.SS, Rank.SSA);
        checkJustBeforeMedian(15.24, 13.5, Rank.SSA, Rank.SSS);

        checkJustBeforeMedian(2.14, 13.6, Rank.C, Rank.BBB);
        checkJustBeforeMedian(6.44, 13.6, Rank.BBB, Rank.A);
        checkJustBeforeMedian(9.59, 13.6, Rank.A, Rank.AA);
        checkJustBeforeMedian(12.09, 13.6, Rank.AA, Rank.S);
        checkJustBeforeMedian(14.09, 13.6, Rank.S, Rank.SS);
        checkJustBeforeMedian(14.84, 13.6, Rank.SS, Rank.SSA);
        checkJustBeforeMedian(15.34, 13.6, Rank.SSA, Rank.SSS);

        checkJustBeforeMedian(2.17, 13.7, Rank.C, Rank.BBB);
        checkJustBeforeMedian(6.52, 13.7, Rank.BBB, Rank.A);
        checkJustBeforeMedian(9.69, 13.7, Rank.A, Rank.AA);
        checkJustBeforeMedian(12.19, 13.7, Rank.AA, Rank.S);
        checkJustBeforeMedian(14.19, 13.7, Rank.S, Rank.SS);
        checkJustBeforeMedian(14.94, 13.7, Rank.SS, Rank.SSA);
        checkJustBeforeMedian(15.44, 13.7, Rank.SSA, Rank.SSS);

        checkJustBeforeMedian(2.19, 13.8, Rank.C, Rank.BBB);
        checkJustBeforeMedian(6.59, 13.8, Rank.BBB, Rank.A);
        checkJustBeforeMedian(9.79, 13.8, Rank.A, Rank.AA);
        checkJustBeforeMedian(12.29, 13.8, Rank.AA, Rank.S);
        checkJustBeforeMedian(14.29, 13.8, Rank.S, Rank.SS);
        checkJustBeforeMedian(15.04, 13.8, Rank.SS, Rank.SSA);
        checkJustBeforeMedian(15.54, 13.8, Rank.SSA, Rank.SSS);

        checkJustBeforeMedian(2.22, 13.9, Rank.C, Rank.BBB);
        checkJustBeforeMedian(6.67, 13.9, Rank.BBB, Rank.A);
        checkJustBeforeMedian(9.89, 13.9, Rank.A, Rank.AA);
        checkJustBeforeMedian(12.39, 13.9, Rank.AA, Rank.S);
        checkJustBeforeMedian(14.39, 13.9, Rank.S, Rank.SS);
        checkJustBeforeMedian(15.14, 13.9, Rank.SS, Rank.SSA);
        checkJustBeforeMedian(15.64, 13.9, Rank.SSA, Rank.SSS);

        checkJustBeforeMedian(2.24, 14.0, Rank.C, Rank.BBB);
        checkJustBeforeMedian(6.74, 14.0, Rank.BBB, Rank.A);
        checkJustBeforeMedian(9.99, 14.0, Rank.A, Rank.AA);
        checkJustBeforeMedian(12.49, 14.0, Rank.AA, Rank.S);
        checkJustBeforeMedian(14.49, 14.0, Rank.S, Rank.SS);
        checkJustBeforeMedian(15.24, 14.0, Rank.SS, Rank.SSA);
        checkJustBeforeMedian(15.74, 14.0, Rank.SSA, Rank.SSS);
    });

    it("範囲外チェック", () => {
        checkOutOfRange(0, 0, 0);
        checkOutOfRange(0, 0, getBorderScore(Rank.S));
        checkOutOfRange(0, 0, getBorderScore(Rank.SSS));
        checkOutOfRange(0, 0, getBorderScore(Rank.Max));
        checkOutOfRange(0, 0, 10000000);

        checkOutOfRange(0, -1, 0);
        checkOutOfRange(0, -1, getBorderScore(Rank.S));
        checkOutOfRange(0, -1, getBorderScore(Rank.SSS));
        checkOutOfRange(0, -1, getBorderScore(Rank.Max));
        checkOutOfRange(0, -1, 10000000);

        checkOutOfRange(0, 3, -1);
        checkOutOfRange(5, 3, 1010000);
        checkOutOfRange(5, 3, 10000000);
        checkOutOfRange(0, 5, -1);
        checkOutOfRange(7, 5, 1010000);
        checkOutOfRange(7, 5, 10000000);
        checkOutOfRange(0, 6, -1);
        checkOutOfRange(8, 6, 1010000);
        checkOutOfRange(8, 6, 10000000);
        checkOutOfRange(0, 13.0, -1);
        checkOutOfRange(15.0, 13.0, 1010000);
        checkOutOfRange(15.0, 13.0, 10000000);
        checkOutOfRange(0, 13.1, -1);
        checkOutOfRange(15.1, 13.1, 1010000);
        checkOutOfRange(15.1, 13.1, 10000000);
        checkOutOfRange(0, 13.2, -1);
        checkOutOfRange(15.2, 13.2, 1010000);
        checkOutOfRange(15.2, 13.2, 10000000);
        checkOutOfRange(0, 13.3, -1);
        checkOutOfRange(15.3, 13.3, 1010000);
        checkOutOfRange(15.3, 13.3, 10000000);
        checkOutOfRange(0, 13.4, -1);
        checkOutOfRange(15.4, 13.4, 1010000);
        checkOutOfRange(15.4, 13.4, 10000000);
        checkOutOfRange(0, 13.5, -1);
        checkOutOfRange(15.5, 13.5, 1010000);
        checkOutOfRange(15.5, 13.5, 10000000);
        checkOutOfRange(0, 13.6, -1);
        checkOutOfRange(15.6, 13.6, 1010000);
        checkOutOfRange(15.6, 13.6, 10000000);
        checkOutOfRange(0, 13.7, -1);
        checkOutOfRange(15.7, 13.7, 1010000);
        checkOutOfRange(15.7, 13.7, 10000000);
        checkOutOfRange(0, 13.8, -1);
        checkOutOfRange(15.8, 13.8, 1010000);
        checkOutOfRange(15.8, 13.8, 10000000);
        checkOutOfRange(0, 13.9, -1);
        checkOutOfRange(15.9, 13.9, 1010000);
        checkOutOfRange(15.9, 13.9, 10000000);
        checkOutOfRange(0, 14.0, -1);
        checkOutOfRange(16.0, 14.0, 1010000);
        checkOutOfRange(16.0, 14.0, 10000000);
    });
});

describe("逆算", () => {
    it("基本テスト 1", () => {
        expect(calcBaseRating(0, (1.0 + 3.0) * 5, 1010000, ComboStatus.AllJustice)).toBe(1.0);
        expect(calcBaseRating(0, (2.0 + 3.0) * 5, 1010000, ComboStatus.AllJustice)).toBe(2.0);
        expect(calcBaseRating(0, (3.0 + 3.0) * 5, 1010000, ComboStatus.AllJustice)).toBe(3.0);
        expect(calcBaseRating(0, (4.0 + 3.0) * 5, 1010000, ComboStatus.AllJustice)).toBe(4.0);
        expect(calcBaseRating(0, (5.0 + 3.0) * 5, 1010000, ComboStatus.AllJustice)).toBe(5.0);
        expect(calcBaseRating(0, (6.0 + 3.0) * 5, 1010000, ComboStatus.AllJustice)).toBe(6.0);
        expect(calcBaseRating(0, (7.0 + 3.0) * 5, 1010000, ComboStatus.AllJustice)).toBe(7.0);
        expect(calcBaseRating(0, (8.0 + 3.0) * 5, 1010000, ComboStatus.AllJustice)).toBe(8.0);
        expect(calcBaseRating(0, (9.0 + 3.0) * 5, 1010000, ComboStatus.AllJustice)).toBe(9.0);
        expect(calcBaseRating(0, (10.0 + 3.0) * 5, 1010000, ComboStatus.AllJustice)).toBe(10.0);
        expect(calcBaseRating(0, (11.0 + 3.0) * 5, 1010000, ComboStatus.AllJustice)).toBe(11.0);
        expect(calcBaseRating(0, (12.0 + 3.0) * 5, 1010000, ComboStatus.AllJustice)).toBe(12.0);
        expect(calcBaseRating(0, (13.0 + 3.0) * 5, 1010000, ComboStatus.AllJustice)).toBe(13.0);
        expect(calcBaseRating(0, (14.0 + 3.0) * 5, 1010000, ComboStatus.AllJustice)).toBe(14.0);
    });

    it("範囲外 基本テスト 1", () => {
        expect(calcBaseRating(0, 100, 0, ComboStatus.None)).toBe(0);
        expect(calcBaseRating(0, 100, 925000 - 1, ComboStatus.None)).toBe(0);
        expect(calcBaseRating(0, 100, 1010000 + 1, ComboStatus.AllJustice)).toBe(0);
        expect(calcBaseRating(100, 0, 1010000, ComboStatus.AllJustice)).toBe(0);
    });

    {
        const startBaseRating = 70;
        const endBaseRating = 70;
        const startScore = 925000;
        const endScore = 1010000;
        const addScore = 1;

        let currentBaseRating = startBaseRating;
        while (currentBaseRating <= endBaseRating) {
            const expectedBaseRating = currentBaseRating / 10;
            it(`プロシージャルテスト ${expectedBaseRating}`, () => {
                for (let score = startScore; score <= endScore; score += addScore) {
                    let diffOp = 0;
                    let actualBaseRating = 0;
                    if (score < 1010000) {
                        diffOp = Math.floor(getOverPower(expectedBaseRating, score, ComboStatus.None) * 100) / 100;
                        actualBaseRating = calcBaseRating(0, diffOp, score, ComboStatus.None);
                        expect(expectedBaseRating).toBeCloseTo(actualBaseRating);

                        diffOp = Math.floor(getOverPower(expectedBaseRating, score, ComboStatus.FullCombo) * 100) / 100;
                        actualBaseRating = calcBaseRating(0, diffOp, score, ComboStatus.FullCombo);
                        expect(expectedBaseRating).toBeCloseTo(actualBaseRating);
                    }
                    if (score >= 1000000) {
                        diffOp = Math.floor(getOverPower(expectedBaseRating, score, ComboStatus.AllJustice) * 100) / 100;
                        actualBaseRating = calcBaseRating(0, diffOp, score, ComboStatus.AllJustice);
                        expect(expectedBaseRating).toBeCloseTo(actualBaseRating);
                    }
                }
            });
            currentBaseRating++;
        }
    }
});