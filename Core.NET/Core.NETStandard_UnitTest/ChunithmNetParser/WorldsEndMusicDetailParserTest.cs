using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmNet.Parser;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace ChunithmClientLibraryUnitTest.ChunithmNetParser
{
    [TestClass]
    [TestCategory(TestUtility.Category.ChunithmNetParser)]
    public class WorldsEndMusicDetailParserTest
    {
        [TestMethod]
        public void WorldsEndMusicDetailParser_Test1()
        {
            var source = TestUtility.LoadResource("WorldsEndMusicDetail/html_test_case_1.html");
            var parser = new WorldsEndMusicDetailParser();
            var worldsEndMusicDetail = parser.Parse(source);
            Assert.IsNotNull(worldsEndMusicDetail, "パースチェック");
            Assert.AreEqual("G e n g a o z o", worldsEndMusicDetail.Name, "楽曲名チェック");
            Assert.AreEqual("-45", worldsEndMusicDetail.ArtistName, "アーティスト名チェック");
            Assert.AreEqual("https://new.chunithm-net.com/chuni-mobile/html/mobile/img/25060651b6218ce9.jpg", worldsEndMusicDetail.ImageName, "ジャケット名チェック");
            Assert.AreEqual(9, worldsEndMusicDetail.WorldsEndLevel, "レベルチェック");
            Assert.AreEqual(WorldsEndType.狂, worldsEndMusicDetail.WorldsEndType, "タイプチェック");
            var unit = worldsEndMusicDetail.WorldsEnd;
            Assert.IsNotNull(unit, "ユニットチェック");
            Assert.IsNull(worldsEndMusicDetail.GetUnit(Difficulty.Invalid), "ユニット取得チェック1");
            Assert.AreEqual(unit, worldsEndMusicDetail.GetUnit(Difficulty.WorldsEnd), "ユニット取得チェック2");
            Assert.AreEqual(Difficulty.WorldsEnd, unit.Difficulty, "難易度チェック");
            Assert.AreEqual(952809, unit.Score, "スコアチェック");
            Assert.AreEqual(true, unit.IsClear, "クリアチェック");
            Assert.AreEqual(ComboStatus.None, unit.ComboStatus, "コンボチェック");
            Assert.AreEqual(ChainStatus.None, unit.ChainStatus, "チェインチェック");
            Assert.AreEqual(3, unit.PlayCount, "プレイ回数チェック");
        }

        [TestMethod]
        public void WorldsEndMusicDetailParser_Error_Test1()
        {
            var worldsEndMusicDetail = new WorldsEndMusicDetailParser().Parse(TestUtility.LoadResource("Common/error_page.html"));
            Assert.IsNull(worldsEndMusicDetail);
        }
    }
}
