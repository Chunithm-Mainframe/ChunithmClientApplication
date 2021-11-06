using ChunithmClientLibrary;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ChunithmClientLibraryUnitTest
{
    [TestClass]
    [TestCategory(TestUtility.Category.Utility)]
    public class RatingTest
    {
        private abstract class GetRatingTestTestCase
        {
            public double ExpectedRating { get; set; }
            public double BaseRating { get; set; }
            public int Score { get; set; }

            protected string message;

            public virtual void Check(int category, int index)
            {
                Assert.AreEqual(
                    ExpectedRating,
                    Utility.GetRating(BaseRating, Score),
                    $"{message} {category}-{index} : {BaseRating}");
            }

            public static void CheckCases(GetRatingTestTestCase[] testCases, int category)
            {
                for (var i = 0; i < testCases.Length; i++)
                {
                    testCases[i].Check(category, i + 1);
                }
            }
        }

        private class GetRatingTest_ボーダーTestCase : GetRatingTestTestCase
        {
            public GetRatingTest_ボーダーTestCase(double expectedRating, double baseRating, Rank rank)
            {
                ExpectedRating = expectedRating;
                BaseRating = baseRating;
                Score = Utility.GetBorderScore(rank);

                message = "ボーダー算出チェック";
            }
        }

        private class GetRatingTest_中間値TestCase : GetRatingTestTestCase
        {
            public GetRatingTest_中間値TestCase(double expectedRating, double baseRating, Rank rank1, Rank rank2)
            {
                ExpectedRating = expectedRating;
                BaseRating = baseRating;
                Score = (Utility.GetBorderScore(rank2) + Utility.GetBorderScore(rank1)) / 2;

                message = "中間値算出チェック";
            }
        }

        private class GetRatingTest_ボーダー境界TestCase : GetRatingTestTestCase
        {
            public GetRatingTest_ボーダー境界TestCase(double expectedRating, double baseRating, Rank rank)
            {
                ExpectedRating = expectedRating;
                BaseRating = baseRating;
                Score = Utility.GetBorderScore(rank) - 1;

                message = "ボーダー境界算出チェック";
            }
        }

        private class GetRatingTest_中間値境界TestCase : GetRatingTestTestCase
        {
            public GetRatingTest_中間値境界TestCase(double expectedRating, double baseRating, Rank rank1, Rank rank2)
            {
                ExpectedRating = expectedRating;
                BaseRating = baseRating;
                Score = (Utility.GetBorderScore(rank2) + Utility.GetBorderScore(rank1)) / 2 - 1;

                message = "中間地境界算出チェック";
            }
        }

        private class GetRatingTest_範囲外TestCase : GetRatingTestTestCase
        {
            public GetRatingTest_範囲外TestCase(double expectedRating, double baseRating, int score)
            {
                ExpectedRating = expectedRating;
                BaseRating = baseRating;
                Score = score;

                message = "範囲外算出チェック";
            }
        }

        [TestMethod]
        public void GetRatingTest_ボーダー()
        {
            {
                var testCases = new[]
                {
                    new GetRatingTest_ボーダーTestCase(0, 3, Rank.AA),
                    new GetRatingTest_ボーダーTestCase(3, 3, Rank.S),
                    new GetRatingTest_ボーダーTestCase(4, 3, Rank.SS),
                    new GetRatingTest_ボーダーTestCase(4.5, 3, Rank.SSA),
                    new GetRatingTest_ボーダーTestCase(5, 3, Rank.SSS),
                    new GetRatingTest_ボーダーTestCase(5.15, 3, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 1);
            }
            {
                var testCases = new[]
                {
                    new GetRatingTest_ボーダーTestCase(0, 5, Rank.A),
                    new GetRatingTest_ボーダーTestCase(2, 5, Rank.AA),
                    new GetRatingTest_ボーダーTestCase(5, 5, Rank.S),
                    new GetRatingTest_ボーダーTestCase(6, 5, Rank.SS),
                    new GetRatingTest_ボーダーTestCase(6.5, 5, Rank.SSA),
                    new GetRatingTest_ボーダーTestCase(7, 5, Rank.SSS),
                    new GetRatingTest_ボーダーTestCase(7.15, 5, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 2);
            }
            {
                var baseRating = 13;
                var testCases = new[]
                {
                    new GetRatingTest_ボーダーTestCase(0, baseRating, Rank.C),
                    new GetRatingTest_ボーダーTestCase(4, baseRating, Rank.BBB),
                    new GetRatingTest_ボーダーTestCase(8, baseRating, Rank.A),
                    new GetRatingTest_ボーダーTestCase(10, baseRating, Rank.AA),
                    new GetRatingTest_ボーダーTestCase(13, baseRating, Rank.S),
                    new GetRatingTest_ボーダーTestCase(14, baseRating, Rank.SS),
                    new GetRatingTest_ボーダーTestCase(14.5, baseRating, Rank.SSA),
                    new GetRatingTest_ボーダーTestCase(15, baseRating, Rank.SSS),
                    new GetRatingTest_ボーダーTestCase(15.15, baseRating, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 3);
            }
            {
                var baseRating = 13.1;
                var testCases = new[]
                {
                    new GetRatingTest_ボーダーTestCase(0, baseRating, Rank.C),
                    new GetRatingTest_ボーダーTestCase(4.05, baseRating, Rank.BBB),
                    new GetRatingTest_ボーダーTestCase(8.1, baseRating, Rank.A),
                    new GetRatingTest_ボーダーTestCase(10.1, baseRating, Rank.AA),
                    new GetRatingTest_ボーダーTestCase(13.1, baseRating, Rank.S),
                    new GetRatingTest_ボーダーTestCase(14.1, baseRating, Rank.SS),
                    new GetRatingTest_ボーダーTestCase(14.6, baseRating, Rank.SSA),
                    new GetRatingTest_ボーダーTestCase(15.1, baseRating, Rank.SSS),
                    new GetRatingTest_ボーダーTestCase(15.25, baseRating, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 4);
            }
            {
                var baseRating = 13.2;
                var testCases = new[]
                {
                    new GetRatingTest_ボーダーTestCase(0, baseRating, Rank.C),
                    new GetRatingTest_ボーダーTestCase(4.1, baseRating, Rank.BBB),
                    new GetRatingTest_ボーダーTestCase(8.2, baseRating, Rank.A),
                    new GetRatingTest_ボーダーTestCase(10.2, baseRating, Rank.AA),
                    new GetRatingTest_ボーダーTestCase(13.2, baseRating, Rank.S),
                    new GetRatingTest_ボーダーTestCase(14.2, baseRating, Rank.SS),
                    new GetRatingTest_ボーダーTestCase(14.7, baseRating, Rank.SSA),
                    new GetRatingTest_ボーダーTestCase(15.2, baseRating, Rank.SSS),
                    new GetRatingTest_ボーダーTestCase(15.35, baseRating, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 5);
            }
            {
                var baseRating = 13.3;
                var testCases = new[]
                {
                    new GetRatingTest_ボーダーTestCase(0, baseRating, Rank.C),
                    new GetRatingTest_ボーダーTestCase(4.15, baseRating, Rank.BBB),
                    new GetRatingTest_ボーダーTestCase(8.3, baseRating, Rank.A),
                    new GetRatingTest_ボーダーTestCase(10.3, baseRating, Rank.AA),
                    new GetRatingTest_ボーダーTestCase(13.3, baseRating, Rank.S),
                    new GetRatingTest_ボーダーTestCase(14.3, baseRating, Rank.SS),
                    new GetRatingTest_ボーダーTestCase(14.8, baseRating, Rank.SSA),
                    new GetRatingTest_ボーダーTestCase(15.3, baseRating, Rank.SSS),
                    new GetRatingTest_ボーダーTestCase(15.45, baseRating, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 6);
            }
            {
                var baseRating = 13.4;
                var testCases = new[]
                {
                    new GetRatingTest_ボーダーTestCase(0, baseRating, Rank.C),
                    new GetRatingTest_ボーダーTestCase(4.2, baseRating, Rank.BBB),
                    new GetRatingTest_ボーダーTestCase(8.4, baseRating, Rank.A),
                    new GetRatingTest_ボーダーTestCase(10.4, baseRating, Rank.AA),
                    new GetRatingTest_ボーダーTestCase(13.4, baseRating, Rank.S),
                    new GetRatingTest_ボーダーTestCase(14.4, baseRating, Rank.SS),
                    new GetRatingTest_ボーダーTestCase(14.9, baseRating, Rank.SSA),
                    new GetRatingTest_ボーダーTestCase(15.4, baseRating, Rank.SSS),
                    new GetRatingTest_ボーダーTestCase(15.55, baseRating, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 7);
            }
            {
                var baseRating = 13.5;
                var testCases = new[]
                {
                    new GetRatingTest_ボーダーTestCase(0, baseRating, Rank.C),
                    new GetRatingTest_ボーダーTestCase(4.25, baseRating, Rank.BBB),
                    new GetRatingTest_ボーダーTestCase(8.5, baseRating, Rank.A),
                    new GetRatingTest_ボーダーTestCase(10.5, baseRating, Rank.AA),
                    new GetRatingTest_ボーダーTestCase(13.5, baseRating, Rank.S),
                    new GetRatingTest_ボーダーTestCase(14.5, baseRating, Rank.SS),
                    new GetRatingTest_ボーダーTestCase(15, baseRating, Rank.SSA),
                    new GetRatingTest_ボーダーTestCase(15.5, baseRating, Rank.SSS),
                    new GetRatingTest_ボーダーTestCase(15.65, baseRating, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 8);
            }
            {
                var baseRating = 13.6;
                var testCases = new[]
                {
                    new GetRatingTest_ボーダーTestCase(0, baseRating, Rank.C),
                    new GetRatingTest_ボーダーTestCase(4.3, baseRating, Rank.BBB),
                    new GetRatingTest_ボーダーTestCase(8.6, baseRating, Rank.A),
                    new GetRatingTest_ボーダーTestCase(10.6, baseRating, Rank.AA),
                    new GetRatingTest_ボーダーTestCase(13.6, baseRating, Rank.S),
                    new GetRatingTest_ボーダーTestCase(14.6, baseRating, Rank.SS),
                    new GetRatingTest_ボーダーTestCase(15.1, baseRating, Rank.SSA),
                    new GetRatingTest_ボーダーTestCase(15.6, baseRating, Rank.SSS),
                    new GetRatingTest_ボーダーTestCase(15.75, baseRating, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 9);
            }
            {
                var baseRating = 13.7;
                var testCases = new[]
                {
                    new GetRatingTest_ボーダーTestCase(0, baseRating, Rank.C),
                    new GetRatingTest_ボーダーTestCase(4.35, baseRating, Rank.BBB),
                    new GetRatingTest_ボーダーTestCase(8.7, baseRating, Rank.A),
                    new GetRatingTest_ボーダーTestCase(10.7, baseRating, Rank.AA),
                    new GetRatingTest_ボーダーTestCase(13.7, baseRating, Rank.S),
                    new GetRatingTest_ボーダーTestCase(14.7, baseRating, Rank.SS),
                    new GetRatingTest_ボーダーTestCase(15.2, baseRating, Rank.SSA),
                    new GetRatingTest_ボーダーTestCase(15.7, baseRating, Rank.SSS),
                    new GetRatingTest_ボーダーTestCase(15.85, baseRating, Rank.SSSA),
                };

                GetRatingTest_ボーダーTestCase.CheckCases(testCases, 10);
            }
            {
                var baseRating = 13.8;
                var testCases = new[]
                {
                    new GetRatingTest_ボーダーTestCase(0, baseRating, Rank.C),
                    new GetRatingTest_ボーダーTestCase(4.4, baseRating, Rank.BBB),
                    new GetRatingTest_ボーダーTestCase(8.8, baseRating, Rank.A),
                    new GetRatingTest_ボーダーTestCase(10.8, baseRating, Rank.AA),
                    new GetRatingTest_ボーダーTestCase(13.8, baseRating, Rank.S),
                    new GetRatingTest_ボーダーTestCase(14.8, baseRating, Rank.SS),
                    new GetRatingTest_ボーダーTestCase(15.3, baseRating, Rank.SSA),
                    new GetRatingTest_ボーダーTestCase(15.8, baseRating, Rank.SSS),
                    new GetRatingTest_ボーダーTestCase(15.95, baseRating, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 11);
            }
            {
                var baseRating = 13.9;
                var testCases = new[]
                {
                    new GetRatingTest_ボーダーTestCase(0, baseRating, Rank.C),
                    new GetRatingTest_ボーダーTestCase(4.45, baseRating, Rank.BBB),
                    new GetRatingTest_ボーダーTestCase(8.9, baseRating, Rank.A),
                    new GetRatingTest_ボーダーTestCase(10.9, baseRating, Rank.AA),
                    new GetRatingTest_ボーダーTestCase(13.9, baseRating, Rank.S),
                    new GetRatingTest_ボーダーTestCase(14.9, baseRating, Rank.SS),
                    new GetRatingTest_ボーダーTestCase(15.4, baseRating, Rank.SSA),
                    new GetRatingTest_ボーダーTestCase(15.9, baseRating, Rank.SSS),
                    new GetRatingTest_ボーダーTestCase(16.05, baseRating, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 12);
            }
            {
                var testCases = new[]
                {
                    new GetRatingTest_ボーダーTestCase(0, 14, Rank.C),
                    new GetRatingTest_ボーダーTestCase(4.5, 14, Rank.BBB),
                    new GetRatingTest_ボーダーTestCase(9, 14, Rank.A),
                    new GetRatingTest_ボーダーTestCase(11, 14, Rank.AA),
                    new GetRatingTest_ボーダーTestCase(14, 14, Rank.S),
                    new GetRatingTest_ボーダーTestCase(15, 14, Rank.SS),
                    new GetRatingTest_ボーダーTestCase(15.5, 14, Rank.SSA),
                    new GetRatingTest_ボーダーTestCase(16, 14, Rank.SSS),
                    new GetRatingTest_ボーダーTestCase(16.15, 14, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 13);
            }
        }

        [TestMethod]
        public void GetRatingTest_中間()
        {
            var category = 1;
            {
                var baseRating = 3;
                var testCases = new[]
                {
                    new GetRatingTest_中間値TestCase(1.5, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値TestCase(3.5, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値TestCase(4.25, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値TestCase(4.75, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値TestCase(5.07, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, category++);
            }
            {
                var baseRating = 5;
                var testCases = new[]
                {
                    new GetRatingTest_中間値TestCase(1, baseRating, Rank.A, Rank.AA),
                    new GetRatingTest_中間値TestCase(3.5, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値TestCase(5.5, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値TestCase(6.25, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値TestCase(6.75, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値TestCase(7.07, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, category++);
            }
            {
                var baseRating = 6;
                var testCases = new[]
                {
                    new GetRatingTest_中間値TestCase(0.25, baseRating, Rank.C, Rank.BBB),
                    new GetRatingTest_中間値TestCase(0.75, baseRating, Rank.BBB, Rank.A),
                    new GetRatingTest_中間値TestCase(2, baseRating, Rank.A, Rank.AA),
                    new GetRatingTest_中間値TestCase(4.5, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値TestCase(6.5, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値TestCase(7.25, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値TestCase(7.75, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値TestCase(8.07, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, category++);
            }
            {
                var baseRating = 13.0;
                var testCases = new[]
                {
                    new GetRatingTest_中間値TestCase(2, baseRating, Rank.C, Rank.BBB),
                    new GetRatingTest_中間値TestCase(6, baseRating, Rank.BBB, Rank.A),
                    new GetRatingTest_中間値TestCase(9, baseRating, Rank.A, Rank.AA),
                    new GetRatingTest_中間値TestCase(11.5, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値TestCase(13.5, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値TestCase(14.25, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値TestCase(14.75, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値TestCase(15.07, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, category++);
            }
            {
                var baseRating = 13.1;
                var testCases = new[]
                {
                    new GetRatingTest_中間値TestCase(2.02, baseRating, Rank.C, Rank.BBB),
                    new GetRatingTest_中間値TestCase(6.07, baseRating, Rank.BBB, Rank.A),
                    new GetRatingTest_中間値TestCase(9.1, baseRating, Rank.A, Rank.AA),
                    new GetRatingTest_中間値TestCase(11.6, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値TestCase(13.6, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値TestCase(14.35, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値TestCase(14.85, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値TestCase(15.17, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, category++);
            }
            {
                var baseRating = 13.2;
                var testCases = new[]
                {
                    new GetRatingTest_中間値TestCase(2.05, baseRating, Rank.C, Rank.BBB),
                    new GetRatingTest_中間値TestCase(6.15, baseRating, Rank.BBB, Rank.A),
                    new GetRatingTest_中間値TestCase(9.2, baseRating, Rank.A, Rank.AA),
                    new GetRatingTest_中間値TestCase(11.7, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値TestCase(13.7, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値TestCase(14.45, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値TestCase(14.95, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値TestCase(15.27, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, category++);
            }
            {
                var baseRating = 13.3;
                var testCases = new[]
                {
                    new GetRatingTest_中間値TestCase(2.07, baseRating, Rank.C, Rank.BBB),
                    new GetRatingTest_中間値TestCase(6.22, baseRating, Rank.BBB, Rank.A),
                    new GetRatingTest_中間値TestCase(9.3, baseRating, Rank.A, Rank.AA),
                    new GetRatingTest_中間値TestCase(11.8, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値TestCase(13.8, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値TestCase(14.55, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値TestCase(15.05, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値TestCase(15.37, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, category++);
            }
            {
                var baseRating = 13.4;
                var testCases = new[]
                {
                    new GetRatingTest_中間値TestCase(2.1, baseRating, Rank.C, Rank.BBB),
                    new GetRatingTest_中間値TestCase(6.3, baseRating, Rank.BBB, Rank.A),
                    new GetRatingTest_中間値TestCase(9.4, baseRating, Rank.A, Rank.AA),
                    new GetRatingTest_中間値TestCase(11.9, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値TestCase(13.9, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値TestCase(14.65, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値TestCase(15.15, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値TestCase(15.47, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, category++);
            }
            {
                var baseRating = 13.5;
                var testCases = new[]
                {
                    new GetRatingTest_中間値TestCase(2.12, baseRating, Rank.C, Rank.BBB),
                    new GetRatingTest_中間値TestCase(6.37, baseRating, Rank.BBB, Rank.A),
                    new GetRatingTest_中間値TestCase(9.5, baseRating, Rank.A, Rank.AA),
                    new GetRatingTest_中間値TestCase(12.0, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値TestCase(14.0, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値TestCase(14.75, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値TestCase(15.25, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値TestCase(15.57, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, category++);
            }
            {
                var baseRating = 13.6;
                var testCases = new[]
                {
                    new GetRatingTest_中間値TestCase(2.15, baseRating, Rank.C, Rank.BBB),
                    new GetRatingTest_中間値TestCase(6.45, baseRating, Rank.BBB, Rank.A),
                    new GetRatingTest_中間値TestCase(9.6, baseRating, Rank.A, Rank.AA),
                    new GetRatingTest_中間値TestCase(12.1, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値TestCase(14.1, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値TestCase(14.85, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値TestCase(15.35, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値TestCase(15.67, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, category++);
            }
            {
                var baseRating = 13.7;
                var testCases = new[]
                {
                    new GetRatingTest_中間値TestCase(2.17, baseRating, Rank.C, Rank.BBB),
                    new GetRatingTest_中間値TestCase(6.52, baseRating, Rank.BBB, Rank.A),
                    new GetRatingTest_中間値TestCase(9.7, baseRating, Rank.A, Rank.AA),
                    new GetRatingTest_中間値TestCase(12.2, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値TestCase(14.2, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値TestCase(14.95, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値TestCase(15.45, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値TestCase(15.77, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, category++);
            }
            {
                var baseRating = 13.8;
                var testCases = new[]
                {
                    new GetRatingTest_中間値TestCase(2.2, baseRating, Rank.C, Rank.BBB),
                    new GetRatingTest_中間値TestCase(6.6, baseRating, Rank.BBB, Rank.A),
                    new GetRatingTest_中間値TestCase(9.8, baseRating, Rank.A, Rank.AA),
                    new GetRatingTest_中間値TestCase(12.3, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値TestCase(14.3, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値TestCase(15.05, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値TestCase(15.55, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値TestCase(15.87, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, category++);
            }
            {
                var baseRating = 13.9;
                var testCases = new[]
                {
                    new GetRatingTest_中間値TestCase(2.22, baseRating, Rank.C, Rank.BBB),
                    new GetRatingTest_中間値TestCase(6.67, baseRating, Rank.BBB, Rank.A),
                    new GetRatingTest_中間値TestCase(9.9, baseRating, Rank.A, Rank.AA),
                    new GetRatingTest_中間値TestCase(12.4, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値TestCase(14.4, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値TestCase(15.15, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値TestCase(15.65, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値TestCase(15.97, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, category++);
            }
            {
                var baseRating = 14.0;
                var testCases = new[]
                {
                    new GetRatingTest_中間値TestCase(2.25, baseRating, Rank.C, Rank.BBB),
                    new GetRatingTest_中間値TestCase(6.75, baseRating, Rank.BBB, Rank.A),
                    new GetRatingTest_中間値TestCase(10, baseRating, Rank.A, Rank.AA),
                    new GetRatingTest_中間値TestCase(12.5, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値TestCase(14.5, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値TestCase(15.25, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値TestCase(15.75, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値TestCase(16.07, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 14);
            }
        }

        [TestMethod]
        public void GetRatingTest_ボーダー境界()
        {
            {
                var testCases = new[]
                {
                    new GetRatingTest_ボーダー境界TestCase(0, 3, Rank.AA),
                    new GetRatingTest_ボーダー境界TestCase(2.99, 3, Rank.S),
                    new GetRatingTest_ボーダー境界TestCase(3.99, 3, Rank.SS),
                    new GetRatingTest_ボーダー境界TestCase(4.49, 3, Rank.SSA),
                    new GetRatingTest_ボーダー境界TestCase(4.99, 3, Rank.SSS),
                    new GetRatingTest_ボーダー境界TestCase(5.14, 3, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 1);
            }
            {
                var testCases = new[]
                {
                    new GetRatingTest_ボーダー境界TestCase(0, 5, Rank.A),
                    new GetRatingTest_ボーダー境界TestCase(1.99, 5, Rank.AA),
                    new GetRatingTest_ボーダー境界TestCase(4.99, 5, Rank.S),
                    new GetRatingTest_ボーダー境界TestCase(5.99, 5, Rank.SS),
                    new GetRatingTest_ボーダー境界TestCase(6.49, 5, Rank.SSA),
                    new GetRatingTest_ボーダー境界TestCase(6.99, 5, Rank.SSS),
                    new GetRatingTest_ボーダー境界TestCase(7.14, 5, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 2);
            }
            {
                var baseRating = 13;
                var testCases = new[]
                {
                    new GetRatingTest_ボーダー境界TestCase(0, baseRating, Rank.C),
                    new GetRatingTest_ボーダー境界TestCase(3.99, baseRating, Rank.BBB),
                    new GetRatingTest_ボーダー境界TestCase(7.99, baseRating, Rank.A),
                    new GetRatingTest_ボーダー境界TestCase(9.99, baseRating, Rank.AA),
                    new GetRatingTest_ボーダー境界TestCase(12.99, baseRating, Rank.S),
                    new GetRatingTest_ボーダー境界TestCase(13.99, baseRating, Rank.SS),
                    new GetRatingTest_ボーダー境界TestCase(14.49, baseRating, Rank.SSA),
                    new GetRatingTest_ボーダー境界TestCase(14.99, baseRating, Rank.SSS),
                    new GetRatingTest_ボーダー境界TestCase(15.14, baseRating, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 3);
            }
            {
                var baseRating = 13.1;
                var testCases = new[]
                {
                    new GetRatingTest_ボーダー境界TestCase(0, baseRating, Rank.C),
                    new GetRatingTest_ボーダー境界TestCase(4.04, baseRating, Rank.BBB),
                    new GetRatingTest_ボーダー境界TestCase(8.09, baseRating, Rank.A),
                    new GetRatingTest_ボーダー境界TestCase(10.09, baseRating, Rank.AA),
                    new GetRatingTest_ボーダー境界TestCase(13.09, baseRating, Rank.S),
                    new GetRatingTest_ボーダー境界TestCase(14.09, baseRating, Rank.SS),
                    new GetRatingTest_ボーダー境界TestCase(14.59, baseRating, Rank.SSA),
                    new GetRatingTest_ボーダー境界TestCase(15.09, baseRating, Rank.SSS),
                    new GetRatingTest_ボーダー境界TestCase(15.24, baseRating, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 4);
            }
            {
                var baseRating = 13.2;
                var testCases = new[]
                {
                    new GetRatingTest_ボーダー境界TestCase(0, baseRating, Rank.C),
                    new GetRatingTest_ボーダー境界TestCase(4.09, baseRating, Rank.BBB),
                    new GetRatingTest_ボーダー境界TestCase(8.19, baseRating, Rank.A),
                    new GetRatingTest_ボーダー境界TestCase(10.19, baseRating, Rank.AA),
                    new GetRatingTest_ボーダー境界TestCase(13.19, baseRating, Rank.S),
                    new GetRatingTest_ボーダー境界TestCase(14.19, baseRating, Rank.SS),
                    new GetRatingTest_ボーダー境界TestCase(14.69, baseRating, Rank.SSA),
                    new GetRatingTest_ボーダー境界TestCase(15.19, baseRating, Rank.SSS),
                    new GetRatingTest_ボーダー境界TestCase(15.34, baseRating, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 5);
            }
            {
                var baseRating = 13.3;
                var testCases = new[]
                {
                    new GetRatingTest_ボーダー境界TestCase(0, baseRating, Rank.C),
                    new GetRatingTest_ボーダー境界TestCase(4.14, baseRating, Rank.BBB),
                    new GetRatingTest_ボーダー境界TestCase(8.29, baseRating, Rank.A),
                    new GetRatingTest_ボーダー境界TestCase(10.29, baseRating, Rank.AA),
                    new GetRatingTest_ボーダー境界TestCase(13.29, baseRating, Rank.S),
                    new GetRatingTest_ボーダー境界TestCase(14.29, baseRating, Rank.SS),
                    new GetRatingTest_ボーダー境界TestCase(14.79, baseRating, Rank.SSA),
                    new GetRatingTest_ボーダー境界TestCase(15.29, baseRating, Rank.SSS),
                    new GetRatingTest_ボーダー境界TestCase(15.44, baseRating, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 6);
            }
            {
                var baseRating = 13.4;
                var testCases = new[]
                {
                    new GetRatingTest_ボーダー境界TestCase(0, baseRating, Rank.C),
                    new GetRatingTest_ボーダー境界TestCase(4.19, baseRating, Rank.BBB),
                    new GetRatingTest_ボーダー境界TestCase(8.39, baseRating, Rank.A),
                    new GetRatingTest_ボーダー境界TestCase(10.39, baseRating, Rank.AA),
                    new GetRatingTest_ボーダー境界TestCase(13.39, baseRating, Rank.S),
                    new GetRatingTest_ボーダー境界TestCase(14.39, baseRating, Rank.SS),
                    new GetRatingTest_ボーダー境界TestCase(14.89, baseRating, Rank.SSA),
                    new GetRatingTest_ボーダー境界TestCase(15.39, baseRating, Rank.SSS),
                    new GetRatingTest_ボーダー境界TestCase(15.54, baseRating, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 7);
            }
            {
                var baseRating = 13.5;
                var testCases = new[]
                {
                    new GetRatingTest_ボーダー境界TestCase(0, baseRating, Rank.C),
                    new GetRatingTest_ボーダー境界TestCase(4.24, baseRating, Rank.BBB),
                    new GetRatingTest_ボーダー境界TestCase(8.49, baseRating, Rank.A),
                    new GetRatingTest_ボーダー境界TestCase(10.49, baseRating, Rank.AA),
                    new GetRatingTest_ボーダー境界TestCase(13.49, baseRating, Rank.S),
                    new GetRatingTest_ボーダー境界TestCase(14.49, baseRating, Rank.SS),
                    new GetRatingTest_ボーダー境界TestCase(14.99, baseRating, Rank.SSA),
                    new GetRatingTest_ボーダー境界TestCase(15.49, baseRating, Rank.SSS),
                    new GetRatingTest_ボーダー境界TestCase(15.64, baseRating, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 8);
            }
            {
                var baseRating = 13.6;
                var testCases = new[]
                {
                    new GetRatingTest_ボーダー境界TestCase(0, baseRating, Rank.C),
                    new GetRatingTest_ボーダー境界TestCase(4.29, baseRating, Rank.BBB),
                    new GetRatingTest_ボーダー境界TestCase(8.59, baseRating, Rank.A),
                    new GetRatingTest_ボーダー境界TestCase(10.59, baseRating, Rank.AA),
                    new GetRatingTest_ボーダー境界TestCase(13.59, baseRating, Rank.S),
                    new GetRatingTest_ボーダー境界TestCase(14.59, baseRating, Rank.SS),
                    new GetRatingTest_ボーダー境界TestCase(15.09, baseRating, Rank.SSA),
                    new GetRatingTest_ボーダー境界TestCase(15.59, baseRating, Rank.SSS),
                    new GetRatingTest_ボーダー境界TestCase(15.74, baseRating, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 9);
            }
            {
                var baseRating = 13.7;
                var testCases = new[]
                {
                    new GetRatingTest_ボーダー境界TestCase(0, baseRating, Rank.C),
                    new GetRatingTest_ボーダー境界TestCase(4.34, baseRating, Rank.BBB),
                    new GetRatingTest_ボーダー境界TestCase(8.69, baseRating, Rank.A),
                    new GetRatingTest_ボーダー境界TestCase(10.69, baseRating, Rank.AA),
                    new GetRatingTest_ボーダー境界TestCase(13.69, baseRating, Rank.S),
                    new GetRatingTest_ボーダー境界TestCase(14.69, baseRating, Rank.SS),
                    new GetRatingTest_ボーダー境界TestCase(15.19, baseRating, Rank.SSA),
                    new GetRatingTest_ボーダー境界TestCase(15.69, baseRating, Rank.SSS),
                    new GetRatingTest_ボーダー境界TestCase(15.84, baseRating, Rank.SSSA),
                };

                GetRatingTest_ボーダー境界TestCase.CheckCases(testCases, 10);
            }
            {
                var baseRating = 13.8;
                var testCases = new[]
                {
                    new GetRatingTest_ボーダー境界TestCase(0, baseRating, Rank.C),
                    new GetRatingTest_ボーダー境界TestCase(4.39, baseRating, Rank.BBB),
                    new GetRatingTest_ボーダー境界TestCase(8.79, baseRating, Rank.A),
                    new GetRatingTest_ボーダー境界TestCase(10.79, baseRating, Rank.AA),
                    new GetRatingTest_ボーダー境界TestCase(13.79, baseRating, Rank.S),
                    new GetRatingTest_ボーダー境界TestCase(14.79, baseRating, Rank.SS),
                    new GetRatingTest_ボーダー境界TestCase(15.29, baseRating, Rank.SSA),
                    new GetRatingTest_ボーダー境界TestCase(15.79, baseRating, Rank.SSS),
                    new GetRatingTest_ボーダー境界TestCase(15.94, baseRating, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 11);
            }
            {
                var baseRating = 13.9;
                var testCases = new[]
                {
                    new GetRatingTest_ボーダー境界TestCase(0, baseRating, Rank.C),
                    new GetRatingTest_ボーダー境界TestCase(4.44, baseRating, Rank.BBB),
                    new GetRatingTest_ボーダー境界TestCase(8.89, baseRating, Rank.A),
                    new GetRatingTest_ボーダー境界TestCase(10.89, baseRating, Rank.AA),
                    new GetRatingTest_ボーダー境界TestCase(13.89, baseRating, Rank.S),
                    new GetRatingTest_ボーダー境界TestCase(14.89, baseRating, Rank.SS),
                    new GetRatingTest_ボーダー境界TestCase(15.39, baseRating, Rank.SSA),
                    new GetRatingTest_ボーダー境界TestCase(15.89, baseRating, Rank.SSS),
                    new GetRatingTest_ボーダー境界TestCase(16.04, baseRating, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 12);
            }
            {
                var testCases = new[]
                {
                    new GetRatingTest_ボーダー境界TestCase(0, 14, Rank.C),
                    new GetRatingTest_ボーダー境界TestCase(4.49, 14, Rank.BBB),
                    new GetRatingTest_ボーダー境界TestCase(8.99, 14, Rank.A),
                    new GetRatingTest_ボーダー境界TestCase(10.99, 14, Rank.AA),
                    new GetRatingTest_ボーダー境界TestCase(13.99, 14, Rank.S),
                    new GetRatingTest_ボーダー境界TestCase(14.99, 14, Rank.SS),
                    new GetRatingTest_ボーダー境界TestCase(15.49, 14, Rank.SSA),
                    new GetRatingTest_ボーダー境界TestCase(15.99, 14, Rank.SSS),
                    new GetRatingTest_ボーダー境界TestCase(16.14, 14, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 13);
            }
        }

        [TestMethod]
        public void GetRatingTest_中間値境界()
        {
            {
                var baseRating = 3;
                var testCases = new[]
                {
                    new GetRatingTest_中間値境界TestCase(1.49, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値境界TestCase(3.49, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値境界TestCase(4.24, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値境界TestCase(4.74, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値境界TestCase(5.07, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 1);
            }
            {
                var baseRating = 5;
                var testCases = new[]
                {
                    new GetRatingTest_中間値境界TestCase(0.99, baseRating, Rank.A, Rank.AA),
                    new GetRatingTest_中間値境界TestCase(3.49, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値境界TestCase(5.49, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値境界TestCase(6.24, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値境界TestCase(6.74, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値境界TestCase(7.07, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 2);
            }
            {
                var baseRating = 6;
                var testCases = new[]
                {
                    new GetRatingTest_中間値境界TestCase(0.24, baseRating, Rank.C, Rank.BBB),
                    new GetRatingTest_中間値境界TestCase(0.74, baseRating, Rank.BBB, Rank.A),
                    new GetRatingTest_中間値境界TestCase(1.99, baseRating, Rank.A, Rank.AA),
                    new GetRatingTest_中間値境界TestCase(4.49, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値境界TestCase(6.49, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値境界TestCase(7.24, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値境界TestCase(7.74, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値境界TestCase(8.07, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 3);
            }
            {
                var baseRating = 13.0;
                var testCases = new[]
                {
                    new GetRatingTest_中間値境界TestCase(1.99, baseRating, Rank.C, Rank.BBB),
                    new GetRatingTest_中間値境界TestCase(5.99, baseRating, Rank.BBB, Rank.A),
                    new GetRatingTest_中間値境界TestCase(8.99, baseRating, Rank.A, Rank.AA),
                    new GetRatingTest_中間値境界TestCase(11.49, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値境界TestCase(13.49, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値境界TestCase(14.24, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値境界TestCase(14.74, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値境界TestCase(15.07, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 4);
            }
            {
                var baseRating = 13.1;
                var testCases = new[]
                {
                    new GetRatingTest_中間値境界TestCase(2.02, baseRating, Rank.C, Rank.BBB),
                    new GetRatingTest_中間値境界TestCase(6.07, baseRating, Rank.BBB, Rank.A),
                    new GetRatingTest_中間値境界TestCase(9.09, baseRating, Rank.A, Rank.AA),
                    new GetRatingTest_中間値境界TestCase(11.59, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値境界TestCase(13.59, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値境界TestCase(14.34, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値境界TestCase(14.84, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値境界TestCase(15.17, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 5);
            }
            {
                var baseRating = 13.2;
                var testCases = new[]
                {
                    new GetRatingTest_中間値境界TestCase(2.04, baseRating, Rank.C, Rank.BBB),
                    new GetRatingTest_中間値境界TestCase(6.14, baseRating, Rank.BBB, Rank.A),
                    new GetRatingTest_中間値境界TestCase(9.19, baseRating, Rank.A, Rank.AA),
                    new GetRatingTest_中間値境界TestCase(11.69, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値境界TestCase(13.69, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値境界TestCase(14.44, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値境界TestCase(14.94, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値境界TestCase(15.27, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 6);
            }
            {
                var baseRating = 13.3;
                var testCases = new[]
                {
                    new GetRatingTest_中間値境界TestCase(2.07, baseRating, Rank.C, Rank.BBB),
                    new GetRatingTest_中間値境界TestCase(6.22, baseRating, Rank.BBB, Rank.A),
                    new GetRatingTest_中間値境界TestCase(9.29, baseRating, Rank.A, Rank.AA),
                    new GetRatingTest_中間値境界TestCase(11.79, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値境界TestCase(13.79, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値境界TestCase(14.54, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値境界TestCase(15.04, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値境界TestCase(15.37, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 7);
            }
            {
                var baseRating = 13.4;
                var testCases = new[]
                {
                    new GetRatingTest_中間値境界TestCase(2.09, baseRating, Rank.C, Rank.BBB),
                    new GetRatingTest_中間値境界TestCase(6.29, baseRating, Rank.BBB, Rank.A),
                    new GetRatingTest_中間値境界TestCase(9.39, baseRating, Rank.A, Rank.AA),
                    new GetRatingTest_中間値境界TestCase(11.89, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値境界TestCase(13.89, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値境界TestCase(14.64, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値境界TestCase(15.14, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値境界TestCase(15.47, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 8);
            }
            {
                var baseRating = 13.5;
                var testCases = new[]
                {
                    new GetRatingTest_中間値境界TestCase(2.12, baseRating, Rank.C, Rank.BBB),
                    new GetRatingTest_中間値境界TestCase(6.37, baseRating, Rank.BBB, Rank.A),
                    new GetRatingTest_中間値境界TestCase(9.49, baseRating, Rank.A, Rank.AA),
                    new GetRatingTest_中間値境界TestCase(11.99, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値境界TestCase(13.99, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値境界TestCase(14.74, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値境界TestCase(15.24, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値境界TestCase(15.57, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 9);
            }
            {
                var baseRating = 13.6;
                var testCases = new[]
                {
                    new GetRatingTest_中間値境界TestCase(2.14, baseRating, Rank.C, Rank.BBB),
                    new GetRatingTest_中間値境界TestCase(6.44, baseRating, Rank.BBB, Rank.A),
                    new GetRatingTest_中間値境界TestCase(9.59, baseRating, Rank.A, Rank.AA),
                    new GetRatingTest_中間値境界TestCase(12.09, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値境界TestCase(14.09, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値境界TestCase(14.84, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値境界TestCase(15.34, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値境界TestCase(15.67, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 10);
            }
            {
                var baseRating = 13.7;
                var testCases = new[]
                {
                    new GetRatingTest_中間値境界TestCase(2.17, baseRating, Rank.C, Rank.BBB),
                    new GetRatingTest_中間値境界TestCase(6.52, baseRating, Rank.BBB, Rank.A),
                    new GetRatingTest_中間値境界TestCase(9.69, baseRating, Rank.A, Rank.AA),
                    new GetRatingTest_中間値境界TestCase(12.19, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値境界TestCase(14.19, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値境界TestCase(14.94, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値境界TestCase(15.44, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値境界TestCase(15.77, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 11);
            }
            {
                var baseRating = 13.8;
                var testCases = new[]
                {
                    new GetRatingTest_中間値境界TestCase(2.19, baseRating, Rank.C, Rank.BBB),
                    new GetRatingTest_中間値境界TestCase(6.59, baseRating, Rank.BBB, Rank.A),
                    new GetRatingTest_中間値境界TestCase(9.79, baseRating, Rank.A, Rank.AA),
                    new GetRatingTest_中間値境界TestCase(12.29, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値境界TestCase(14.29, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値境界TestCase(15.04, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値境界TestCase(15.54, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値境界TestCase(15.87, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 12);
            }
            {
                var baseRating = 13.9;
                var testCases = new[]
                {
                    new GetRatingTest_中間値境界TestCase(2.22, baseRating, Rank.C, Rank.BBB),
                    new GetRatingTest_中間値境界TestCase(6.67, baseRating, Rank.BBB, Rank.A),
                    new GetRatingTest_中間値境界TestCase(9.89, baseRating, Rank.A, Rank.AA),
                    new GetRatingTest_中間値境界TestCase(12.39, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値境界TestCase(14.39, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値境界TestCase(15.14, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値境界TestCase(15.64, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値境界TestCase(15.97, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 13);
            }
            {
                var baseRating = 14.0;
                var testCases = new[]
                {
                    new GetRatingTest_中間値境界TestCase(2.24, baseRating, Rank.C, Rank.BBB),
                    new GetRatingTest_中間値境界TestCase(6.74, baseRating, Rank.BBB, Rank.A),
                    new GetRatingTest_中間値境界TestCase(9.99, baseRating, Rank.A, Rank.AA),
                    new GetRatingTest_中間値境界TestCase(12.49, baseRating, Rank.AA, Rank.S),
                    new GetRatingTest_中間値境界TestCase(14.49, baseRating, Rank.S, Rank.SS),
                    new GetRatingTest_中間値境界TestCase(15.24, baseRating, Rank.SS, Rank.SSA),
                    new GetRatingTest_中間値境界TestCase(15.74, baseRating, Rank.SSA, Rank.SSS),
                    new GetRatingTest_中間値境界TestCase(16.07, baseRating, Rank.SSS, Rank.SSSA),
                };

                GetRatingTestTestCase.CheckCases(testCases, 14);
            }
        }

        [TestMethod]
        public void GetRatingTest_範囲外()
        {
            var category = 1;
            {
                var testCases = new[]
                {
                    new GetRatingTest_範囲外TestCase(0, 0, 0),
                    new GetRatingTest_範囲外TestCase(0, 0, Utility.GetBorderScore(Rank.S)),
                    new GetRatingTest_範囲外TestCase(0, 0, Utility.GetBorderScore(Rank.SSS)),
                    new GetRatingTest_範囲外TestCase(0, 0, 1010000),
                    new GetRatingTest_範囲外TestCase(0, 0, 10000000),
                };

                GetRatingTestTestCase.CheckCases(testCases, category++);
            }
            {
                var testCases = new[]
                {
                    new GetRatingTest_範囲外TestCase(0, -1, 0),
                    new GetRatingTest_範囲外TestCase(0, -1, Utility.GetBorderScore(Rank.S)),
                    new GetRatingTest_範囲外TestCase(0, -1, Utility.GetBorderScore(Rank.SSS)),
                    new GetRatingTest_範囲外TestCase(0, -1, 1010000),
                    new GetRatingTest_範囲外TestCase(0, -1, 10000000),
                };

                GetRatingTestTestCase.CheckCases(testCases, category++);
            }
            {
                var testCases = new[]
                {
                    new GetRatingTest_範囲外TestCase(0, 3, -1),
                    new GetRatingTest_範囲外TestCase(5.15, 3, 1010000),
                    new GetRatingTest_範囲外TestCase(5.15, 3, 10000000),
                    new GetRatingTest_範囲外TestCase(0, 5, -1),
                    new GetRatingTest_範囲外TestCase(7.15, 5, 1010000),
                    new GetRatingTest_範囲外TestCase(7.15, 5, 10000000),
                    new GetRatingTest_範囲外TestCase(0, 6, -1),
                    new GetRatingTest_範囲外TestCase(8.15, 6, 1010000),
                    new GetRatingTest_範囲外TestCase(8.15, 6, 10000000),
                    new GetRatingTest_範囲外TestCase(0, 13.0, -1),
                    new GetRatingTest_範囲外TestCase(15.15, 13.0, 1010000),
                    new GetRatingTest_範囲外TestCase(15.15, 13.0, 10000000),
                    new GetRatingTest_範囲外TestCase(0, 15.1, -1),
                    new GetRatingTest_範囲外TestCase(15.25, 13.1, 1010000),
                    new GetRatingTest_範囲外TestCase(15.25, 13.1, 10000000),
                    new GetRatingTest_範囲外TestCase(0, 13.2, -1),
                    new GetRatingTest_範囲外TestCase(15.35, 13.2, 1010000),
                    new GetRatingTest_範囲外TestCase(15.35, 13.2, 10000000),
                    new GetRatingTest_範囲外TestCase(0, 13.3, -1),
                    new GetRatingTest_範囲外TestCase(15.45, 13.3, 1010000),
                    new GetRatingTest_範囲外TestCase(15.45, 13.3, 10000000),
                    new GetRatingTest_範囲外TestCase(0, 13.4, -1),
                    new GetRatingTest_範囲外TestCase(15.55, 13.4, 1010000),
                    new GetRatingTest_範囲外TestCase(15.55, 13.4, 10000000),
                    new GetRatingTest_範囲外TestCase(0, 13.5, -1),
                    new GetRatingTest_範囲外TestCase(15.65, 13.5, 1010000),
                    new GetRatingTest_範囲外TestCase(15.65, 13.5, 10000000),
                    new GetRatingTest_範囲外TestCase(0, 13.6, -1),
                    new GetRatingTest_範囲外TestCase(15.75, 13.6, 1010000),
                    new GetRatingTest_範囲外TestCase(15.75, 13.6, 10000000),
                    new GetRatingTest_範囲外TestCase(0, 13.7, -1),
                    new GetRatingTest_範囲外TestCase(15.85, 13.7, 1010000),
                    new GetRatingTest_範囲外TestCase(15.85, 13.7, 10000000),
                    new GetRatingTest_範囲外TestCase(0, 13.8, -1),
                    new GetRatingTest_範囲外TestCase(15.95, 13.8, 1010000),
                    new GetRatingTest_範囲外TestCase(15.95, 13.8, 10000000),
                    new GetRatingTest_範囲外TestCase(0, 13.9, -1),
                    new GetRatingTest_範囲外TestCase(16.05, 13.9, 1010000),
                    new GetRatingTest_範囲外TestCase(16.05, 13.9, 10000000),
                    new GetRatingTest_範囲外TestCase(0, 14.0, -1),
                    new GetRatingTest_範囲外TestCase(16.15, 14.0, 1010000),
                    new GetRatingTest_範囲外TestCase(16.15, 14.0, 10000000),
                };

                GetRatingTestTestCase.CheckCases(testCases, category++);
            }
        }
    }
}
