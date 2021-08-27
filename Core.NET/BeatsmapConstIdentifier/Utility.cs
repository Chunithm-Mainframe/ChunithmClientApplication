using System.Collections.Generic;
using System.Linq;

namespace BeatsmapConstIdentifier
{
    public static class Utility
    {
        public const int Infinity = 1000000007;

        private static readonly List<(int score, int offset)> borders = new()
        {
            (1007500, 200),
            (1005000, 150),
            (1000000, 100),
            (975000, 0),
            (925000, -300),
            (900000, -500),
        };

        public static int ScoreToOffset(int score)
        {
            if (score >= borders.First().score)
            {
                return borders.First().offset;
            }

            for (var i = 1; i < borders.Count; i++)
            {
                if (score >= borders[i].score)
                {
                    var nextBorder = borders[i - 1];
                    var currentBorder = borders[i];
                    // 小数第3位より下は自動切り捨て
                    // 計算順に注意! C++の int(32bit符号付き整数) には収まる
                    return currentBorder.offset + (nextBorder.offset - currentBorder.offset) * (score - currentBorder.score) / (nextBorder.score - currentBorder.score);
                }
            }
            // A未満なので、データ破棄
            return -Infinity;
        }
    }
}
