using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmNet.Parser;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ChunithmClientLibraryUnitTest.ChunithmNetParser
{
    [TestClass]
    [TestCategory(TestUtility.Category.ChunithmNetParser)]
    public class WorldsEndMusicParserTest
    {
        [TestMethod]
        public void WorldsEndMusicParser_Test1()
        {
            var worldsEndMusic = new WorldsEndMusicParser().Parse(TestUtility.LoadResource("WorldsEndMusic/html_test_case_1.html"));
            Assert.IsNotNull(worldsEndMusic, "パースチェック");

            var units = worldsEndMusic.Units;
            Assert.AreEqual(55, units.Length, "件数チェック");
            {
                var unit = units[0];
                Assert.IsNotNull(unit);
                Assert.AreEqual(8108, unit.Id, "楽曲ID");
                Assert.AreEqual("G e n g a o z o", unit.Name, "楽曲名");
                Assert.AreEqual(Difficulty.WorldsEnd, unit.Difficulty, "難易度");
                Assert.AreEqual(9, unit.WorldsEndLevel, "WEレベル");
                Assert.AreEqual(WorldsEndType.狂, unit.WorldsEndType, "WEタイプ");
                Assert.AreEqual(205950, unit.Score, "スコア");
                Assert.AreEqual(Rank.D, unit.Rank, "ランク");
                Assert.AreEqual(false, unit.IsClear, "クリア");
                Assert.AreEqual(ComboStatus.None, unit.ComboStatus, "コンボランプ");
                Assert.AreEqual(ChainStatus.None, unit.ChainStatus, "チェインランプ");
            }
            {
                var unit = units[1];
                Assert.IsNotNull(unit);
                Assert.AreEqual(8104, unit.Id, "楽曲ID");
                Assert.AreEqual("玩具狂奏曲 -終焉-", unit.Name, "楽曲名");
                Assert.AreEqual(Difficulty.WorldsEnd, unit.Difficulty, "難易度");
                Assert.AreEqual(9, unit.WorldsEndLevel, "WEレベル");
                Assert.AreEqual(WorldsEndType.蔵, unit.WorldsEndType, "WEタイプ");
                Assert.AreEqual(988665, unit.Score, "スコア");
                Assert.AreEqual(Rank.S, unit.Rank, "ランク");
                Assert.AreEqual(true, unit.IsClear, "クリア");
                Assert.AreEqual(ComboStatus.None, unit.ComboStatus, "コンボランプ");
                Assert.AreEqual(ChainStatus.None, unit.ChainStatus, "チェインランプ");
            }
        }

        [TestMethod]
        public void WorldsEndMusicParser_Test2()
        {
            var worldsEndMusic = new WorldsEndMusicParser().Parse(TestUtility.LoadResource("WorldsEndMusic/html_test_case_2.html"));
            Assert.IsNotNull(worldsEndMusic, "パースチェック");

            var units = worldsEndMusic.Units;
            Assert.AreEqual(59, units.Length, "件数チェック");
            {
                var unit = units[1];
                Assert.IsNotNull(unit);
                Assert.AreEqual(8112, unit.Id, "楽曲ID");
                Assert.AreEqual("HAELEQUIN (Original Remaster)", unit.Name, "楽曲名");
                Assert.AreEqual(Difficulty.WorldsEnd, unit.Difficulty, "難易度");
                Assert.AreEqual(7, unit.WorldsEndLevel, "WEレベル");
                Assert.AreEqual(WorldsEndType.両, unit.WorldsEndType, "WEタイプ");
                Assert.AreEqual(0, unit.Score, "スコア");
                Assert.AreEqual(Rank.None, unit.Rank, "ランク");
                Assert.AreEqual(false, unit.IsClear, "クリア");
                Assert.AreEqual(ComboStatus.None, unit.ComboStatus, "コンボランプ");
                Assert.AreEqual(ChainStatus.None, unit.ChainStatus, "チェインランプ");
            }
            {
                var unit = units[2];
                Assert.IsNotNull(unit);
                Assert.AreEqual(8113, unit.Id, "楽曲ID");
                Assert.AreEqual("Theme of SeelischTact", unit.Name, "楽曲名");
                Assert.AreEqual(Difficulty.WorldsEnd, unit.Difficulty, "難易度");
                Assert.AreEqual(5, unit.WorldsEndLevel, "WEレベル");
                Assert.AreEqual(WorldsEndType.弾, unit.WorldsEndType, "WEタイプ");
                Assert.AreEqual(0, unit.Score, "スコア");
                Assert.AreEqual(Rank.None, unit.Rank, "ランク");
                Assert.AreEqual(false, unit.IsClear, "クリア");
                Assert.AreEqual(ComboStatus.None, unit.ComboStatus, "コンボランプ");
                Assert.AreEqual(ChainStatus.None, unit.ChainStatus, "チェインランプ");
            }
        }

        [TestMethod]
        public void WorldsEndMusicParser_Error_Test1()
        {
            var worldsEndMusic = new WorldsEndMusicParser().Parse(TestUtility.LoadResource("Common/error_page.html"));
            Assert.IsNull(worldsEndMusic);
        }
    }
}
