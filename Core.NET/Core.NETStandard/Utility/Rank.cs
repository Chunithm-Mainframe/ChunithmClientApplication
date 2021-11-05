namespace ChunithmClientLibrary
{
    public enum Rank
    {
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

    public static partial class Utility
    {
        private const int RANK_NONE_BORDER_SCORE = 0;
        private const string RANK_NONE_TEXT = "NONE";
        private const int RANK_NONE_CODE = -1;

        private class RankPair
        {
            public Rank Rank { get; }
            public int Score { get; }
            public string Text { get; }
            public int Code { get; }

            public RankPair(Rank rank, int score, string text, int code)
            {
                Rank = rank;
                Score = score;
                Text = text;
                Code = code;
            }
        }

        private static readonly RankPair[] rankPairs = new RankPair[]
        {
            new RankPair(Rank.Max,  score : 1010000, text : "MAX",  code : 13),
            new RankPair(Rank.SSSA, score : 1009000, text : "SSS+", code : 13),
            new RankPair(Rank.SSS,  score : 1007500, text : "SSS",  code : 12),
            new RankPair(Rank.SSA,  score : 1005000, text : "SS+",  code : 11),
            new RankPair(Rank.SS,   score : 1000000, text : "SS",   code : 10),
            new RankPair(Rank.SA,   score :  990000, text : "S+",   code : 9),
            new RankPair(Rank.S,    score :  975000, text : "S",    code : 8),
            new RankPair(Rank.AAA,  score :  950000, text : "AAA",  code : 7),
            new RankPair(Rank.AA,   score :  925000, text : "AA",   code : 6),
            new RankPair(Rank.A,    score :  900000, text : "A",    code : 5),
            new RankPair(Rank.BBB,  score :  800000, text : "BBB",  code : 4),
            new RankPair(Rank.BB,   score :  700000, text : "BB",   code : 3),
            new RankPair(Rank.B,    score :  600000, text : "B",    code : 2),
            new RankPair(Rank.C,    score :  500000, text : "C",    code : 1),
            new RankPair(Rank.D,    score :       0, text : "D",    code : 0),
            new RankPair(Rank.None, score :       0, text : "NONE", code : -1),
        };

        public static int GetBorderScore(Rank rank)
        {
            return PairConverter.Convert(rankPairs, rank, RANK_NONE_BORDER_SCORE, p => p.Rank, p => p.Score);
        }

        public static Rank GetRank(int score)
        {
            return PairConverter.Convert(rankPairs, Rank.None, p => p.Score, p => p.Rank, value => score >= value);
        }

        public static Rank ToRank(int rankCode)
        {
            // MAXが先にチェックされてしまうため
            if (rankCode == 13)
            {
                return Rank.SSSA;
            }

            return PairConverter.Convert(rankPairs, rankCode, Rank.None, p => p.Code, p => p.Rank);
        }

        public static Rank ToRank(string rankText)
        {
            return PairConverter.Convert(rankPairs, rankText, Rank.None, p => p.Text, p => p.Rank);
        }

        public static string ToRankText(Rank rank)
        {
            return PairConverter.Convert(rankPairs, rank, RANK_NONE_TEXT, p => p.Rank, p => p.Text);
        }

        public static int ToRankCode(Rank rank)
        {
            return PairConverter.Convert(rankPairs, rank, RANK_NONE_CODE, p => p.Rank, p => p.Code);
        }

        public static int ToRankCode(string rankText)
        {
            return PairConverter.Convert(rankPairs, rankText, RANK_NONE_CODE, p => p.Text, p => p.Code);
        }
    }
}
