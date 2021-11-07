using ChunithmClientLibrary;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ChunithmClientLibraryUnitTest
{
    [TestClass]
    [TestCategory(TestUtility.Category.Utility)]
    public class RankTest
    {
        [TestMethod]
        public void Rank_Convert_RankToBorderScore_Test1()
        {
            Assert.AreEqual(Utility.GetBorderScore(Rank.Max), 1010000, "理論値ボーダースコア");
            Assert.AreEqual(Utility.GetBorderScore(Rank.SSS), 1007500, "SSSボーダースコア");
            Assert.AreEqual(Utility.GetBorderScore(Rank.SSA), 1005000, "SS+ボーダースコア");
            Assert.AreEqual(Utility.GetBorderScore(Rank.SS), 1000000, "SSボーダースコア");
            Assert.AreEqual(Utility.GetBorderScore(Rank.S), 975000, "Sボーダースコア");
            Assert.AreEqual(Utility.GetBorderScore(Rank.AAA), 950000, "AAAボーダースコア");
            Assert.AreEqual(Utility.GetBorderScore(Rank.AA), 925000, "AAボーダースコア");
            Assert.AreEqual(Utility.GetBorderScore(Rank.A), 900000, "Aボーダースコア");
            Assert.AreEqual(Utility.GetBorderScore(Rank.BBB), 800000, "BBBボーダースコア");
            Assert.AreEqual(Utility.GetBorderScore(Rank.BB), 700000, "BBボーダースコア");
            Assert.AreEqual(Utility.GetBorderScore(Rank.B), 600000, "Bボーダースコア");
            Assert.AreEqual(Utility.GetBorderScore(Rank.C), 500000, "Cボーダースコア");
            Assert.AreEqual(Utility.GetBorderScore(Rank.D), 0, "Dボーダースコア");
            Assert.AreEqual(Utility.GetBorderScore(Rank.None), 0, "NONE");
        }

        [TestMethod]
        public void Rank_Convert_ScoreToRank_Test1()
        {
            Assert.AreEqual(Rank.Max, Utility.GetRank(1100000), "理論値オーバー");
            Assert.AreEqual(Rank.Max, Utility.GetRank(1010000), "理論値");
            Assert.AreEqual(Rank.SSSA, Utility.GetRank(1009999));
            Assert.AreEqual(Rank.SSSA, Utility.GetRank(1009000), "SSS+");
            Assert.AreEqual(Rank.SSS, Utility.GetRank(1008750));
            Assert.AreEqual(Rank.SSS, Utility.GetRank(1007501));
            Assert.AreEqual(Rank.SSS, Utility.GetRank(1007500), "SSS");
            Assert.AreEqual(Rank.SSA, Utility.GetRank(1007499));
            Assert.AreEqual(Rank.SSA, Utility.GetRank(1006250));
            Assert.AreEqual(Rank.SSA, Utility.GetRank(1005001));
            Assert.AreEqual(Rank.SSA, Utility.GetRank(1005000), "SS+");
            Assert.AreEqual(Rank.SS, Utility.GetRank(1004999));
            Assert.AreEqual(Rank.SS, Utility.GetRank(1002500));
            Assert.AreEqual(Rank.SS, Utility.GetRank(1000001));
            Assert.AreEqual(Rank.SS, Utility.GetRank(1000000), "SS");
            Assert.AreEqual(Rank.SA, Utility.GetRank(999999));
            Assert.AreEqual(Rank.SA, Utility.GetRank(990000), "S+");
            Assert.AreEqual(Rank.S, Utility.GetRank(987500));
            Assert.AreEqual(Rank.S, Utility.GetRank(975001));
            Assert.AreEqual(Rank.S, Utility.GetRank(975000), "S");
            Assert.AreEqual(Rank.AAA, Utility.GetRank(974999));
            Assert.AreEqual(Rank.AAA, Utility.GetRank(962500));
            Assert.AreEqual(Rank.AAA, Utility.GetRank(950001));
            Assert.AreEqual(Rank.AAA, Utility.GetRank(950000), "AAA");
            Assert.AreEqual(Rank.AA, Utility.GetRank(949999));
            Assert.AreEqual(Rank.AA, Utility.GetRank(937500));
            Assert.AreEqual(Rank.AA, Utility.GetRank(925001));
            Assert.AreEqual(Rank.AA, Utility.GetRank(925000), "AA");
            Assert.AreEqual(Rank.A, Utility.GetRank(924999));
            Assert.AreEqual(Rank.A, Utility.GetRank(912500));
            Assert.AreEqual(Rank.A, Utility.GetRank(900001));
            Assert.AreEqual(Rank.A, Utility.GetRank(900000), "A");
            Assert.AreEqual(Rank.BBB, Utility.GetRank(899999));
            Assert.AreEqual(Rank.BBB, Utility.GetRank(850000));
            Assert.AreEqual(Rank.BBB, Utility.GetRank(800001));
            Assert.AreEqual(Rank.BBB, Utility.GetRank(800000), "BBB");
            Assert.AreEqual(Rank.BB, Utility.GetRank(799999));
            Assert.AreEqual(Rank.BB, Utility.GetRank(750000));
            Assert.AreEqual(Rank.BB, Utility.GetRank(700001));
            Assert.AreEqual(Rank.BB, Utility.GetRank(700000), "BB");
            Assert.AreEqual(Rank.B, Utility.GetRank(699999));
            Assert.AreEqual(Rank.B, Utility.GetRank(650000));
            Assert.AreEqual(Rank.B, Utility.GetRank(600001));
            Assert.AreEqual(Rank.B, Utility.GetRank(600000), "B");
            Assert.AreEqual(Rank.C, Utility.GetRank(599999));
            Assert.AreEqual(Rank.C, Utility.GetRank(550000));
            Assert.AreEqual(Rank.C, Utility.GetRank(500001));
            Assert.AreEqual(Rank.C, Utility.GetRank(500000), "C");
            Assert.AreEqual(Rank.D, Utility.GetRank(499999));
            Assert.AreEqual(Rank.D, Utility.GetRank(250000));
            Assert.AreEqual(Rank.D, Utility.GetRank(1));
            Assert.AreEqual(Rank.D, Utility.GetRank(0), "D");
            Assert.AreEqual(Rank.None, Utility.GetRank(-1), "範囲外");
        }

        [TestMethod]
        public void Rank_Convert_RankCodeToRank_Test1()
        {
            Assert.AreEqual(Rank.None, Utility.ToRank(14), "範囲外");
            Assert.AreEqual(Rank.SSSA, Utility.ToRank(13), "SSS+");
            Assert.AreEqual(Rank.SSS, Utility.ToRank(12), "SSS");
            Assert.AreEqual(Rank.SSA, Utility.ToRank(11), "SS+");
            Assert.AreEqual(Rank.SS, Utility.ToRank(10), "SS");
            Assert.AreEqual(Rank.SA, Utility.ToRank(9), "S+");
            Assert.AreEqual(Rank.S, Utility.ToRank(8), "S");
            Assert.AreEqual(Rank.AAA, Utility.ToRank(7), "AAA");
            Assert.AreEqual(Rank.AA, Utility.ToRank(6), "AA");
            Assert.AreEqual(Rank.A, Utility.ToRank(5), "A");
            Assert.AreEqual(Rank.BBB, Utility.ToRank(4), "BBB");
            Assert.AreEqual(Rank.BB, Utility.ToRank(3), "BB");
            Assert.AreEqual(Rank.B, Utility.ToRank(2), "B");
            Assert.AreEqual(Rank.C, Utility.ToRank(1), "C");
            Assert.AreEqual(Rank.D, Utility.ToRank(0), "D");
            Assert.AreEqual(Rank.None, Utility.ToRank(-1), "範囲外");
        }

        [TestMethod]
        public void Rank_Convert_RankTextToRank_Test1()
        {
            Assert.AreEqual(Rank.SSSA, Utility.ToRank("SSS+"), "SSS+");
            Assert.AreEqual(Rank.SSS, Utility.ToRank("SSS"), "SSS");
            Assert.AreEqual(Rank.SSA, Utility.ToRank("SS+"), "SS+");
            Assert.AreEqual(Rank.SS, Utility.ToRank("SS"), "SS");
            Assert.AreEqual(Rank.SA, Utility.ToRank("S+"), "S+");
            Assert.AreEqual(Rank.S, Utility.ToRank("S"), "S");
            Assert.AreEqual(Rank.AAA, Utility.ToRank("AAA"), "AAA");
            Assert.AreEqual(Rank.AA, Utility.ToRank("AA"), "AA");
            Assert.AreEqual(Rank.A, Utility.ToRank("A"), "A");
            Assert.AreEqual(Rank.BBB, Utility.ToRank("BBB"), "BBB");
            Assert.AreEqual(Rank.BB, Utility.ToRank("BB"), "BB");
            Assert.AreEqual(Rank.B, Utility.ToRank("B"), "B");
            Assert.AreEqual(Rank.C, Utility.ToRank("C"), "C");
            Assert.AreEqual(Rank.D, Utility.ToRank("D"), "D");
            Assert.AreEqual(Rank.None, Utility.ToRank("NONE"), "NONE");

            Assert.AreEqual(Rank.None, Utility.ToRank(null));
            Assert.AreEqual(Rank.None, Utility.ToRank(""));

            Assert.AreEqual(Rank.None, Utility.ToRank("SSs"));
            Assert.AreEqual(Rank.None, Utility.ToRank("SsS"));
            Assert.AreEqual(Rank.None, Utility.ToRank("sSS"));
            Assert.AreEqual(Rank.None, Utility.ToRank("sss"));
            Assert.AreEqual(Rank.None, Utility.ToRank("ＳＳＳ"));

            Assert.AreEqual(Rank.None, Utility.ToRank("Ss+"));
            Assert.AreEqual(Rank.None, Utility.ToRank("sS+"));
            Assert.AreEqual(Rank.None, Utility.ToRank("ss+"));
            Assert.AreEqual(Rank.None, Utility.ToRank("ＳＳ＋"));

            Assert.AreEqual(Rank.None, Utility.ToRank("Ss"));
            Assert.AreEqual(Rank.None, Utility.ToRank("sS"));
            Assert.AreEqual(Rank.None, Utility.ToRank("ss"));
            Assert.AreEqual(Rank.None, Utility.ToRank("ＳＳ"));

            Assert.AreEqual(Rank.None, Utility.ToRank("s"));
            Assert.AreEqual(Rank.None, Utility.ToRank("Ｓ"));

            Assert.AreEqual(Rank.None, Utility.ToRank("AAa"));
            Assert.AreEqual(Rank.None, Utility.ToRank("AaA"));
            Assert.AreEqual(Rank.None, Utility.ToRank("aAA"));
            Assert.AreEqual(Rank.None, Utility.ToRank("aaa"));
            Assert.AreEqual(Rank.None, Utility.ToRank("ＡＡＡ"));

            Assert.AreEqual(Rank.None, Utility.ToRank("Aa"));
            Assert.AreEqual(Rank.None, Utility.ToRank("aA"));
            Assert.AreEqual(Rank.None, Utility.ToRank("aa"));
            Assert.AreEqual(Rank.None, Utility.ToRank("ＡＡ"));

            Assert.AreEqual(Rank.None, Utility.ToRank("a"));
            Assert.AreEqual(Rank.None, Utility.ToRank("Ａ"));

            Assert.AreEqual(Rank.None, Utility.ToRank("BBb"));
            Assert.AreEqual(Rank.None, Utility.ToRank("BbB"));
            Assert.AreEqual(Rank.None, Utility.ToRank("bBB"));
            Assert.AreEqual(Rank.None, Utility.ToRank("ＢＢＢ"));

            Assert.AreEqual(Rank.None, Utility.ToRank("Bb"));
            Assert.AreEqual(Rank.None, Utility.ToRank("bB"));
            Assert.AreEqual(Rank.None, Utility.ToRank("bb"));
            Assert.AreEqual(Rank.None, Utility.ToRank("ＢＢ"));

            Assert.AreEqual(Rank.None, Utility.ToRank("b"));
            Assert.AreEqual(Rank.None, Utility.ToRank("Ｂ"));

            Assert.AreEqual(Rank.None, Utility.ToRank("c"));
            Assert.AreEqual(Rank.None, Utility.ToRank("Ｃ"));

            Assert.AreEqual(Rank.None, Utility.ToRank("d"));
            Assert.AreEqual(Rank.None, Utility.ToRank("Ｄ"));
        }

        [TestMethod]
        public void Rank_Convert_RankToRankText_Test1()
        {
            Assert.AreEqual("SSS+", Utility.ToRankText(Rank.SSSA), "SSS+");
            Assert.AreEqual("SSS", Utility.ToRankText(Rank.SSS), "SSS");
            Assert.AreEqual("SS+", Utility.ToRankText(Rank.SSA), "SS+");
            Assert.AreEqual("SS", Utility.ToRankText(Rank.SS), "SS");
            Assert.AreEqual("S+", Utility.ToRankText(Rank.SA), "S");
            Assert.AreEqual("S", Utility.ToRankText(Rank.S), "S");
            Assert.AreEqual("AAA", Utility.ToRankText(Rank.AAA), "AAA");
            Assert.AreEqual("AA", Utility.ToRankText(Rank.AA), "AA");
            Assert.AreEqual("A", Utility.ToRankText(Rank.A), "A");
            Assert.AreEqual("BBB", Utility.ToRankText(Rank.BBB), "BBB");
            Assert.AreEqual("BB", Utility.ToRankText(Rank.BB), "BB");
            Assert.AreEqual("B", Utility.ToRankText(Rank.B), "B");
            Assert.AreEqual("C", Utility.ToRankText(Rank.C), "C");
            Assert.AreEqual("D", Utility.ToRankText(Rank.D), "D");
            Assert.AreEqual("NONE", Utility.ToRankText(Rank.None), "NONE");
        }

        [TestMethod]
        public void Rank_Convert_RankToRankCode_Test1()
        {
            Assert.AreEqual(13, Utility.ToRankCode(Rank.SSSA), "SSS+");
            Assert.AreEqual(12, Utility.ToRankCode(Rank.SSS), "SSS");
            Assert.AreEqual(11, Utility.ToRankCode(Rank.SSA), "SS+");
            Assert.AreEqual(10, Utility.ToRankCode(Rank.SS), "SS");
            Assert.AreEqual(9, Utility.ToRankCode(Rank.SA), "S+");
            Assert.AreEqual(8, Utility.ToRankCode(Rank.S), "S");
            Assert.AreEqual(7, Utility.ToRankCode(Rank.AAA), "AAA");
            Assert.AreEqual(6, Utility.ToRankCode(Rank.AA), "AA");
            Assert.AreEqual(5, Utility.ToRankCode(Rank.A), "A");
            Assert.AreEqual(4, Utility.ToRankCode(Rank.BBB), "BBB");
            Assert.AreEqual(3, Utility.ToRankCode(Rank.BB), "BB");
            Assert.AreEqual(2, Utility.ToRankCode(Rank.B), "B");
            Assert.AreEqual(1, Utility.ToRankCode(Rank.C), "C");
            Assert.AreEqual(0, Utility.ToRankCode(Rank.D), "D");
            Assert.AreEqual(-1, Utility.ToRankCode(Rank.None), "NONE");
        }

        [TestMethod]
        public void Rank_Convert_RankTextToRankCode_Test1()
        {
            Assert.AreEqual(13, Utility.ToRankCode("SSS+"), "SSS+");
            Assert.AreEqual(12, Utility.ToRankCode("SSS"), "SSS");
            Assert.AreEqual(11, Utility.ToRankCode("SS+"), "SS+");
            Assert.AreEqual(10, Utility.ToRankCode("SS"), "SS");
            Assert.AreEqual(9, Utility.ToRankCode("S+"), "S+");
            Assert.AreEqual(8, Utility.ToRankCode("S"), "S");
            Assert.AreEqual(7, Utility.ToRankCode("AAA"), "AAA");
            Assert.AreEqual(6, Utility.ToRankCode("AA"), "AA");
            Assert.AreEqual(5, Utility.ToRankCode("A"), "A");
            Assert.AreEqual(4, Utility.ToRankCode("BBB"), "BBB");
            Assert.AreEqual(3, Utility.ToRankCode("BB"), "BB");
            Assert.AreEqual(2, Utility.ToRankCode("B"), "B");
            Assert.AreEqual(1, Utility.ToRankCode("C"), "C");
            Assert.AreEqual(0, Utility.ToRankCode("D"), "D");
            Assert.AreEqual(-1, Utility.ToRankCode("NONE"), "NONE");

            Assert.AreEqual(-1, Utility.ToRankCode(null));
            Assert.AreEqual(-1, Utility.ToRankCode(""));

            Assert.AreEqual(-1, Utility.ToRankCode("SSs"));
            Assert.AreEqual(-1, Utility.ToRankCode("SsS"));
            Assert.AreEqual(-1, Utility.ToRankCode("sSS"));
            Assert.AreEqual(-1, Utility.ToRankCode("sss"));
            Assert.AreEqual(-1, Utility.ToRankCode("ＳＳＳ"));

            Assert.AreEqual(-1, Utility.ToRankCode("Ss+"));
            Assert.AreEqual(-1, Utility.ToRankCode("sS+"));
            Assert.AreEqual(-1, Utility.ToRankCode("ss+"));
            Assert.AreEqual(-1, Utility.ToRankCode("ＳＳ＋"));

            Assert.AreEqual(-1, Utility.ToRankCode("Ss"));
            Assert.AreEqual(-1, Utility.ToRankCode("sS"));
            Assert.AreEqual(-1, Utility.ToRankCode("ss"));
            Assert.AreEqual(-1, Utility.ToRankCode("ＳＳ"));

            Assert.AreEqual(-1, Utility.ToRankCode("s"));
            Assert.AreEqual(-1, Utility.ToRankCode("Ｓ"));

            Assert.AreEqual(-1, Utility.ToRankCode("AAa"));
            Assert.AreEqual(-1, Utility.ToRankCode("AaA"));
            Assert.AreEqual(-1, Utility.ToRankCode("aAA"));
            Assert.AreEqual(-1, Utility.ToRankCode("aaa"));
            Assert.AreEqual(-1, Utility.ToRankCode("ＡＡＡ"));

            Assert.AreEqual(-1, Utility.ToRankCode("Aa"));
            Assert.AreEqual(-1, Utility.ToRankCode("aA"));
            Assert.AreEqual(-1, Utility.ToRankCode("aa"));
            Assert.AreEqual(-1, Utility.ToRankCode("ＡＡ"));

            Assert.AreEqual(-1, Utility.ToRankCode("a"));
            Assert.AreEqual(-1, Utility.ToRankCode("Ａ"));

            Assert.AreEqual(-1, Utility.ToRankCode("BBb"));
            Assert.AreEqual(-1, Utility.ToRankCode("BbB"));
            Assert.AreEqual(-1, Utility.ToRankCode("bBB"));
            Assert.AreEqual(-1, Utility.ToRankCode("ＢＢＢ"));

            Assert.AreEqual(-1, Utility.ToRankCode("Bb"));
            Assert.AreEqual(-1, Utility.ToRankCode("bB"));
            Assert.AreEqual(-1, Utility.ToRankCode("bb"));
            Assert.AreEqual(-1, Utility.ToRankCode("ＢＢ"));

            Assert.AreEqual(-1, Utility.ToRankCode("b"));
            Assert.AreEqual(-1, Utility.ToRankCode("Ｂ"));

            Assert.AreEqual(-1, Utility.ToRankCode("c"));
            Assert.AreEqual(-1, Utility.ToRankCode("Ｃ"));

            Assert.AreEqual(-1, Utility.ToRankCode("d"));
            Assert.AreEqual(-1, Utility.ToRankCode("Ｄ"));
        }
    }
}
