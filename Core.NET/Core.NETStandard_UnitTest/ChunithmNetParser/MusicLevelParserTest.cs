using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmNet.Parser;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ChunithmClientLibraryUnitTest.ChunithmNetParser
{
    [TestClass]
    [TestCategory(TestUtility.Category.ChunithmNetParser)]
    public class MusicLevelParserTest
    {
        [TestMethod]
        public void MusicLevelParser_Test1()
        {
            var musicLevel = new MusicLevelParser().Parse(TestUtility.LoadResource("MusicLevel/html_test_case_1.html"));
            Assert.IsNotNull(musicLevel, "パースチェック");

            Assert.AreEqual(165, musicLevel.MusicCount, "楽曲数");
            Assert.AreEqual(143, musicLevel.ClearCount, "クリア 楽曲数");
            Assert.AreEqual(143, musicLevel.SCount, "S 楽曲数");
            Assert.AreEqual(143, musicLevel.SaCount, "S+ 楽曲数");
            Assert.AreEqual(143, musicLevel.SsCount, "SS 楽曲数");
            Assert.AreEqual(139, musicLevel.SsaCount, "SS+ 楽曲数");
            Assert.AreEqual(133, musicLevel.SssCount, "SSS 楽曲数");
            Assert.AreEqual(58, musicLevel.SssaCount, "SSS+ 楽曲数");
            Assert.AreEqual(90, musicLevel.FullComboCount, "フルコンボ 楽曲数");
            Assert.AreEqual(23, musicLevel.AllJusticeCount, "AJ 楽曲数");
            Assert.AreEqual(0, musicLevel.FullChainGoldCount, "フルチェイン(金) 楽曲数");
            Assert.AreEqual(0, musicLevel.FullChainPlatinumCount, "フルチェイン 楽曲数");

            var units = musicLevel.Units;
            Assert.AreEqual(165, units.Length, "件数チェック");
            {
                var unit = units[0];
                Assert.IsNotNull(unit);
                Assert.AreEqual(2140, unit.Id, "ID");
                Assert.AreEqual("ピアノ協奏曲第１番”蠍火”", unit.Name, "楽曲名");
                Assert.AreEqual(Difficulty.Expert, unit.Difficulty, "難易度");
                Assert.AreEqual(14.0, unit.Level, "レベル");
                Assert.AreEqual(0, unit.Score, "スコア");
                Assert.AreEqual(Rank.None, unit.Rank, "ランク");
                Assert.AreEqual(false, unit.IsClear, "クリア");
                Assert.AreEqual(ComboStatus.None, unit.ComboStatus, "コンボランプ");
                Assert.AreEqual(ChainStatus.None, unit.ChainStatus, "チェインランプ");
            }
            {
                var unit = units[2];
                Assert.IsNotNull(unit);
                Assert.AreEqual(978, unit.Id, "ID");
                Assert.AreEqual("Ascension to Heaven", unit.Name, "楽曲名");
                Assert.AreEqual(Difficulty.Expert, unit.Difficulty, "難易度");
                Assert.AreEqual(14.0, unit.Level, "レベル");
                Assert.AreEqual(1009894, unit.Score, "スコア");
                Assert.AreEqual(Rank.SSSA, unit.Rank, "ランク");
                Assert.AreEqual(true, unit.IsClear, "クリア");
                Assert.AreEqual(ComboStatus.AllJustice, unit.ComboStatus, "コンボランプ");
                Assert.AreEqual(ChainStatus.None, unit.ChainStatus, "チェインランプ");
            }
            {
                var unit = units[5];
                Assert.IsNotNull(unit);
                Assert.AreEqual(777, unit.Id, "ID");
                Assert.AreEqual("Killing Rhythm", unit.Name, "楽曲名");
                Assert.AreEqual(Difficulty.Expert, unit.Difficulty, "難易度");
                Assert.AreEqual(14.0, unit.Level, "レベル");
                Assert.AreEqual(1008286, unit.Score, "スコア");
                Assert.AreEqual(Rank.SSS, unit.Rank, "ランク");
                Assert.AreEqual(true, unit.IsClear, "クリア");
                Assert.AreEqual(ComboStatus.FullCombo, unit.ComboStatus, "コンボランプ");
                Assert.AreEqual(ChainStatus.None, unit.ChainStatus, "チェインランプ");
            }
            {
                var unit = units[10];
                Assert.IsNotNull(unit);
                Assert.AreEqual(964, unit.Id, "ID");
                Assert.AreEqual("殺人レコード恐怖のメロディ", unit.Name, "楽曲名");
                Assert.AreEqual(Difficulty.Master, unit.Difficulty, "難易度");
                Assert.AreEqual(14.0, unit.Level, "レベル");
                Assert.AreEqual(1009927, unit.Score, "スコア");
                Assert.AreEqual(Rank.SSSA, unit.Rank, "ランク");
                Assert.AreEqual(true, unit.IsClear, "クリア");
                Assert.AreEqual(ComboStatus.AllJustice, unit.ComboStatus, "コンボランプ");
                Assert.AreEqual(ChainStatus.None, unit.ChainStatus, "チェインランプ");
            }
        }

        [TestMethod]
        public void MusicLevelParser_Test2()
        {
            var musicLevel = new MusicLevelParser().Parse(TestUtility.LoadResource("MusicLevel/html_test_case_2.html"));
            Assert.IsNotNull(musicLevel, "パースチェック");

            Assert.AreEqual(124, musicLevel.MusicCount, "楽曲数");
            Assert.AreEqual(112, musicLevel.ClearCount, "クリア 楽曲数");
            Assert.AreEqual(112, musicLevel.SCount, "S 楽曲数");
            Assert.AreEqual(111, musicLevel.SaCount, "S+ 楽曲数");
            Assert.AreEqual(109, musicLevel.SsCount, "SS 楽曲数");
            Assert.AreEqual(77, musicLevel.SsaCount, "SS+ 楽曲数");
            Assert.AreEqual(43, musicLevel.SssCount, "SSS 楽曲数");
            Assert.AreEqual(3, musicLevel.SssaCount, "SSS+ 楽曲数");
            Assert.AreEqual(22, musicLevel.FullComboCount, "フルコンボ 楽曲数");
            Assert.AreEqual(0, musicLevel.AllJusticeCount, "AJ 楽曲数");
            Assert.AreEqual(0, musicLevel.FullChainGoldCount, "フルチェイン(金) 楽曲数");
            Assert.AreEqual(0, musicLevel.FullChainPlatinumCount, "フルチェイン 楽曲数");

            var units = musicLevel.Units;
            Assert.AreEqual(124, units.Length, "件数チェック");
            {
                var unit = units[0];
                Assert.IsNotNull(unit);
                Assert.AreEqual(1086, unit.Id, "ID");
                Assert.AreEqual("祈 -我ら神祖と共に歩む者なり-", unit.Name, "楽曲名");
                Assert.AreEqual(Difficulty.Expert, unit.Difficulty, "難易度");
                Assert.AreEqual(14.5, unit.Level, "レベル");
                Assert.AreEqual(0, unit.Score, "スコア");
                Assert.AreEqual(Rank.None, unit.Rank, "ランク");
                Assert.AreEqual(false, unit.IsClear, "クリア");
                Assert.AreEqual(ComboStatus.None, unit.ComboStatus, "コンボランプ");
                Assert.AreEqual(ChainStatus.None, unit.ChainStatus, "チェインランプ");
            }
            {
                var unit = units[1];
                Assert.IsNotNull(unit);
                Assert.AreEqual(2012, unit.Id, "ID");
                Assert.AreEqual("紅", unit.Name, "楽曲名");
                Assert.AreEqual(Difficulty.Master, unit.Difficulty, "難易度");
                Assert.AreEqual(14.5, unit.Level, "レベル");
                Assert.AreEqual(988987, unit.Score, "スコア");
                Assert.AreEqual(Rank.S, unit.Rank, "ランク");
                Assert.AreEqual(true, unit.IsClear, "クリア");
                Assert.AreEqual(ComboStatus.None, unit.ComboStatus, "コンボランプ");
                Assert.AreEqual(ChainStatus.None, unit.ChainStatus, "チェインランプ");
            }
            {
                Assert.AreEqual(Rank.SA, units[5].Rank, "ランク S+");
                Assert.AreEqual(Rank.SS, units[6].Rank, "ランク SS");
                Assert.AreEqual(Rank.SSA, units[7].Rank, "ランク SS+");
            }
        }

        [TestMethod]
        public void MusicLevelParser_Error_Test1()
        {
            var musicLevel = new MusicLevelParser().Parse(TestUtility.LoadResource("Common/error_page.html"));
            Assert.IsNull(musicLevel);
        }
    }
}
