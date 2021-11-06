using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmNet.Parser;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace ChunithmClientLibraryUnitTest.ChunithmNetParser
{
    [TestClass]
    [TestCategory(TestUtility.Category.ChunithmNetParser)]
    [TestCategory(TestUtility.Category.HtmlParser)]
    public class PlaylogParserTest
    {
        [TestMethod]
        public void PlaylogParser_Test1()
        {
            var parser = new PlaylogParser();
            var playlog = parser.Parse(TestUtility.LoadResource("Playlog/html_test_case_1.html"));
            Assert.IsNotNull(playlog, "パースチェック");

            var units = playlog.Units;
            Assert.AreEqual(10, units.Length, "件数チェック");
            {
                var data = units[8];
                Assert.IsNotNull(data, "data");
                Assert.AreEqual("封焔の135秒", data.Name, "楽曲名");
                Assert.AreEqual("https://new.chunithm-net.com/chuni-mobile/html/mobile/img/2272c496042e872b.jpg", data.ImageName, "イメージ名");
                Assert.AreEqual(Difficulty.Master, data.Difficulty, "難易度");
                Assert.AreEqual(1002144, data.Score, "スコア");
                Assert.AreEqual(Rank.SS, data.Rank, "ランク");
                Assert.AreEqual(true, data.IsClear, "クリア");
                Assert.AreEqual(true, data.IsNewRecord, "ニューレコード");
                Assert.AreEqual(ComboStatus.None, data.ComboStatus, "コンボランプ");
                Assert.AreEqual(ChainStatus.None, data.ChainStatus, "チェインランプ");
                Assert.AreEqual(2, data.Track, "トラック");
                Assert.AreEqual(new DateTime(2021, 11, 4, 20, 52, 0), data.PlayDate, "プレイ日時");
            }
            {
                var data = units[5];
                Assert.IsNotNull(data, "data");
                Assert.AreEqual("疾走あんさんぶる", data.Name, "楽曲名");
                Assert.AreEqual("https://new.chunithm-net.com/chuni-mobile/html/mobile/img/5f055248d79b18b7.jpg", data.ImageName, "イメージ名");
                Assert.AreEqual(Difficulty.Master, data.Difficulty, "難易度");
                Assert.AreEqual(1008246, data.Score, "スコア");
                Assert.AreEqual(Rank.SSS, data.Rank, "ランク");
                Assert.AreEqual(true, data.IsClear, "クリア");
                Assert.AreEqual(false, data.IsNewRecord, "ニューレコード");
                Assert.AreEqual(ComboStatus.FullCombo, data.ComboStatus, "コンボランプ");
                Assert.AreEqual(ChainStatus.None, data.ChainStatus, "チェインランプ");
                Assert.AreEqual(3, data.Track, "トラック");
                Assert.AreEqual(new DateTime(2021, 11, 4, 20, 40, 0), data.PlayDate, "プレイ日時");
            }
        }

        [TestMethod]
        public void PlaylogParser_Error_Test1()
        {
            var playlog = new PlaylogParser().Parse(TestUtility.LoadResource("Common/error_page.html"));
            Assert.IsNull(playlog);
        }
    }
}
