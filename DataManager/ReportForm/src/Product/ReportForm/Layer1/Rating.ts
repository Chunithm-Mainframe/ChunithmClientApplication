class Rating {
    private static readonly borderScoreMap: Record<Rank, number> = {
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

    public static getBorderScore(rank: Rank): number {
        return this.borderScoreMap[rank];
    }

    public static getBorderBaseRating(levelText: string): number {
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

    public static getRating(baseRating: number, score: number): number {
        return Math.floor(this.getIntegerPlayRating(baseRating, score)) / 100;
    }

    public static getOverPower(baseRating: number, score: number, comboStatus: ComboStatus): number {
        const integerPlayRating = this.getIntegerPlayRating(baseRating, score, true);
        if (integerPlayRating <= 0) {
            return 0;
        }

        let basePoint = integerPlayRating;
        if (score >= this.borderScoreMap[Rank.Max]) {
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
        if (score < this.borderScoreMap[Rank.S]) {
            overPower = Math.floor(overPower) / 100;
        }
        else {
            overPower = overPower / 100;
        }

        return overPower;
    }

    private static getIntegerPlayRating(baseRating: number, score: number, asOverPower = false): number {
        if (baseRating <= 0 || score <= 0) {
            return 0;
        }

        const integerBaseRating = this.convertToIntegerRating(baseRating);
        const borders = this.getBordersAsIntegerRating(integerBaseRating, asOverPower);

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

    private static convertToIntegerRating(rating: number): number {
        return Math.round(rating * 100);
    }

    private static getBordersAsIntegerRating(integerBaseRating: number, asOverPower: boolean): { score: number; integerRating: number }[] {
        if (asOverPower) {
            return [
                { score: this.borderScoreMap[Rank.Max] + 1, integerRating: integerBaseRating + 275 },
                { score: this.borderScoreMap[Rank.Max], integerRating: integerBaseRating + 275 },
                { score: this.borderScoreMap[Rank.SSS], integerRating: integerBaseRating + 200 },
                { score: this.borderScoreMap[Rank.SSA], integerRating: integerBaseRating + 150 },
                { score: this.borderScoreMap[Rank.SS], integerRating: integerBaseRating + 100 },
                { score: this.borderScoreMap[Rank.S], integerRating: integerBaseRating },
                { score: this.borderScoreMap[Rank.AA], integerRating: Math.max(integerBaseRating - 300, 0) },
                { score: this.borderScoreMap[Rank.A], integerRating: Math.max(integerBaseRating - 500, 0) },
                { score: this.borderScoreMap[Rank.BBB], integerRating: Math.max((integerBaseRating - 500) / 2.0, 0) },
                { score: this.borderScoreMap[Rank.C], integerRating: 0 },
                { score: this.borderScoreMap[Rank.D], integerRating: 0 },
            ];
        }
        else {
            return [
                { score: this.borderScoreMap[Rank.SSSA] + 1, integerRating: integerBaseRating + 215 },
                { score: this.borderScoreMap[Rank.SSSA], integerRating: integerBaseRating + 215 },
                { score: this.borderScoreMap[Rank.SSS], integerRating: integerBaseRating + 200 },
                { score: this.borderScoreMap[Rank.SSA], integerRating: integerBaseRating + 150 },
                { score: this.borderScoreMap[Rank.SS], integerRating: integerBaseRating + 100 },
                { score: this.borderScoreMap[Rank.S], integerRating: integerBaseRating },
                { score: this.borderScoreMap[Rank.AA], integerRating: Math.max(integerBaseRating - 300, 0) },
                { score: this.borderScoreMap[Rank.A], integerRating: Math.max(integerBaseRating - 500, 0) },
                { score: this.borderScoreMap[Rank.BBB], integerRating: Math.max((integerBaseRating - 500) / 2.0, 0) },
                { score: this.borderScoreMap[Rank.C], integerRating: 0 },
                { score: this.borderScoreMap[Rank.D], integerRating: 0 },
            ];
        }
    }

    public static calcBaseRating(beforeOp: number, afterOp: number, score: number, comboStatus: ComboStatus): number {
        if (score < this.borderScoreMap[Rank.AA] || score > this.borderScoreMap[Rank.Max]) {
            return 0;
        }

        if (beforeOp > afterOp) {
            return 0;
        }

        const diffOp = afterOp - beforeOp;
        let added = 0;
        if (score >= this.borderScoreMap[Rank.Max]) {
            added = 2.75;
        }
        else if (score >= this.borderScoreMap[Rank.SSS]) {
            added = 2.0 + 0.75 * (score - this.borderScoreMap[Rank.SSS]) / (this.borderScoreMap[Rank.Max] - this.borderScoreMap[Rank.SSS]);
        }
        else if (score >= this.borderScoreMap[Rank.SSA]) {
            added = 1.5 + 0.5 * (score - this.borderScoreMap[Rank.SSA]) / (this.borderScoreMap[Rank.SSS] - this.borderScoreMap[Rank.SSA]);
        }
        else if (score >= this.borderScoreMap[Rank.SS]) {
            added = 1.0 + 0.5 * (score - this.borderScoreMap[Rank.SS]) / (this.borderScoreMap[Rank.SSA] - this.borderScoreMap[Rank.SS]);
        }
        else if (score >= this.borderScoreMap[Rank.S]) {
            added = 1.0 * (score - this.borderScoreMap[Rank.S]) / (this.borderScoreMap[Rank.SS] - this.borderScoreMap[Rank.S]);
        }
        else if (score >= this.borderScoreMap[Rank.AA]) {
            added = -3.0 + 3.0 * (score - this.borderScoreMap[Rank.AA]) / (this.borderScoreMap[Rank.S] - this.borderScoreMap[Rank.AA]);
        }
        switch (comboStatus) {
            case ComboStatus.AllJustice:
                if (score >= this.borderScoreMap[Rank.Max]) {
                    added += 0.25;
                } else {
                    added += 0.2;
                }
                break;
            case ComboStatus.FullCombo:
                added += 0.1;
                break;
        }

        const baseRating = score >= this.borderScoreMap[Rank.S]
            ? Math.round((diffOp / 5 - added) * 100) / 100
            : Math.round((diffOp / 5 - added) * 10) / 10
        return baseRating;
    }
}
