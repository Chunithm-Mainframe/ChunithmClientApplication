using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.ChunithmNet.Parser;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace ChunithmClientLibraryUnitTest.ChunithmNetParser
{
    [TestClass]
    [TestCategory(TestUtility.Category.ChunithmNetParser)]
    public class MusicDetailParserTest
    {
        [TestMethod]
        public void MusicDetailParser_Test1()
        {
            var path = TestUtility.GetResourcePath("MusicDetail/html_test_case_1.html");
            var source = Utility.LoadStringContent(path);
            var parser = new MusicDetailParser();
            var musicDetail = parser.Parse(source);
            Assert.IsNotNull(musicDetail, "パースチェック");
            Assert.AreEqual("怒槌", musicDetail.Name, "楽曲名チェック");
            Assert.AreEqual("光吉猛修", musicDetail.ArtistName, "アーティスト名チェック");
            Assert.AreEqual("https://new.chunithm-net.com/chuni-mobile/html/mobile/img/a732d43fd2a11e8f.jpg", musicDetail.ImageName, "イメージ名チェック");

            {
                var expected = new MusicDetail.Unit
                {
                    Difficulty = Difficulty.Basic,
                    Score = 1010000,
                    Rank = Rank.SSSA,
                    IsClear = true,
                    ComboStatus = ComboStatus.AllJustice,
                    ChainStatus = ChainStatus.None,
                    PlayCount = 124
                };
                var actual = musicDetail.Basic;

                AreEqualUnit(expected, actual);
            }
            {
                var expected = new MusicDetail.Unit
                {
                    Difficulty = Difficulty.Advanced,
                    Score = 1010000,
                    Rank = Rank.SSSA,
                    IsClear = true,
                    ComboStatus = ComboStatus.AllJustice,
                    ChainStatus = ChainStatus.None,
                    PlayCount = 63
                };
                var actual = musicDetail.Advanced;

                AreEqualUnit(expected, actual);
            }
            {
                var expected = new MusicDetail.Unit
                {
                    Difficulty = Difficulty.Expert,
                    Score = 1009760,
                    Rank = Rank.SSSA,
                    IsClear = true,
                    ComboStatus = ComboStatus.AllJustice,
                    ChainStatus = ChainStatus.None,
                    PlayCount = 40
                };
                var actual = musicDetail.Expert;

                AreEqualUnit(expected, actual);
            }
            {
                var expected = new MusicDetail.Unit
                {
                    Difficulty = Difficulty.Master,
                    Score = 999930,
                    Rank = Rank.SA,
                    IsClear = true,
                    ComboStatus = ComboStatus.None,
                    ChainStatus = ChainStatus.None,
                    PlayCount = 213
                };
                var actual = musicDetail.Master;

                AreEqualUnit(expected, actual);
            }
        }

        public void AreEqualUnit(MusicDetail.Unit expected, MusicDetail.Unit actual)
        {
            Assert.IsNotNull(actual);
            Assert.AreEqual(expected.Difficulty, actual.Difficulty, "難易度");
            Assert.AreEqual(expected.Score, actual.Score, "スコア");
            Assert.AreEqual(expected.Rank, actual.Rank, "ランク");
            Assert.AreEqual(expected.IsClear, actual.IsClear, "クリア");
            Assert.AreEqual(expected.ComboStatus, actual.ComboStatus, "フルコンボステータス");
            Assert.AreEqual(expected.ChainStatus, actual.ChainStatus, "フルチェインステータス");
            Assert.AreEqual(expected.PlayCount, actual.PlayCount, "プレイ回数");
        }

        [TestMethod]
        public void MusicDetailParser_Error_Test1()
        {
            var musicDetail = new MusicDetailParser().Parse(TestUtility.LoadResource("Common/error_page.html"));
            Assert.IsNull(musicDetail);
        }
    }
}
