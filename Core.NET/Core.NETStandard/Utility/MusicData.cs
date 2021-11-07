using System;

namespace ChunithmClientLibrary
{
    public static partial class Utility
    {
        public static double GetRating(double baseRating, int score)
        {
            var playRating = GetPlayRating(baseRating, score);
            return (double)(Math.Floor(playRating * 100) / 100);
        }

        public static double GetOverPower(double baseRating, int score, ComboStatus comboStatus)
        {
            var playRating = GetPlayRating(baseRating, score, true);
            if (playRating <= 0)
            {
                return 0;
            }

            var basePoint = playRating;
            if (score >= GetBorderScore(Rank.Max))
            {
                basePoint += 0.25m;
            }
            else
            {
                switch (comboStatus)
                {
                    case ComboStatus.AllJustice:
                        basePoint += 0.2m;
                        break;
                    case ComboStatus.FullCombo:
                        basePoint += 0.1m;
                        break;
                }
            }

            var overPower = basePoint * 5;
            if (score < GetBorderScore(Rank.S))
            {
                overPower = Math.Floor(overPower * 100) / 100;
            }

            return (double)overPower;
        }

        private static decimal GetPlayRating(double baseRating, int score, bool asOverPower = false)
        {
            return GetPlayRating((decimal)baseRating, score, asOverPower);
        }

        private static decimal GetPlayRating(decimal baseRating, int score, bool asOverPower = false)
        {
            if (baseRating <= 0 || score <= 0)
            {
                return 0;
            }

            var borders = GetBorders(baseRating, score, asOverPower);

            for (var i = 1; i < borders.Length; i++)
            {
                var nextBorder = borders[i - 1];
                var border = borders[i];
                if (score >= border.Item1)
                {
                    var ratio = (decimal)(score - border.Item1) / (nextBorder.Item1 - border.Item1);
                    var playRating = ratio * (nextBorder.Item2 - border.Item2) + border.Item2;
                    return playRating;
                }
            }

            return 0;
        }

        private static Tuple<int, decimal>[] GetBorders(decimal baseRating, int score, bool asOverPowerRating = false)
        {
            if (asOverPowerRating)
            {
                return new[]
                {
                    new Tuple<int, decimal>(GetBorderScore(Rank.Max) + 1, baseRating + 2.75m),
                    new Tuple<int, decimal>(GetBorderScore(Rank.Max), baseRating + 2.75m),
                    new Tuple<int, decimal>(GetBorderScore(Rank.SSS), baseRating + 2.0m),
                    new Tuple<int, decimal>(GetBorderScore(Rank.SSA), baseRating + 1.5m),
                    new Tuple<int, decimal>(GetBorderScore(Rank.SS), baseRating + 1.0m),
                    new Tuple<int, decimal>(GetBorderScore(Rank.S), baseRating),
                    new Tuple<int, decimal>(GetBorderScore(Rank.AA), Math.Max(baseRating - 3.0m, 0)),
                    new Tuple<int, decimal>(GetBorderScore(Rank.A), Math.Max(baseRating - 5.0m, 0)),
                    new Tuple<int, decimal>(GetBorderScore(Rank.BBB), Math.Max((baseRating - 5.0m) / 2.0m, 0)),
                    new Tuple<int, decimal>(GetBorderScore(Rank.C), 0.0m),
                    new Tuple<int, decimal>(GetBorderScore(Rank.D), 0.0m),
                };
            }
            else
            {
                return new[]
                {
                    new Tuple<int, decimal>(GetBorderScore(Rank.SSSA) + 1, baseRating + 2.15m),
                    new Tuple<int, decimal>(GetBorderScore(Rank.SSSA), baseRating + 2.15m),
                    new Tuple<int, decimal>(GetBorderScore(Rank.SSS), baseRating + 2.0m),
                    new Tuple<int, decimal>(GetBorderScore(Rank.SSA), baseRating + 1.5m),
                    new Tuple<int, decimal>(GetBorderScore(Rank.SS), baseRating + 1.0m),
                    new Tuple<int, decimal>(GetBorderScore(Rank.S), baseRating),
                    new Tuple<int, decimal>(GetBorderScore(Rank.AA), Math.Max(baseRating - 3.0m, 0)),
                    new Tuple<int, decimal>(GetBorderScore(Rank.A), Math.Max(baseRating - 5.0m, 0)),
                    new Tuple<int, decimal>(GetBorderScore(Rank.BBB), Math.Max((baseRating - 5.0m) / 2.0m, 0)),
                    new Tuple<int, decimal>(GetBorderScore(Rank.C), 0.0m),
                    new Tuple<int, decimal>(GetBorderScore(Rank.D), 0.0m),
                };
            }
        }
    }
}
