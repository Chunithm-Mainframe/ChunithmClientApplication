using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.ChunithmNet.Parser;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace ChunithmClientLibraryUnitTest.ChunithmNetParser
{
    [TestClass]
    [TestCategory(TestUtility.Category.ChunithmNetParser)]
    public class PlaylogDetailParserTest
    {
        [TestMethod]
        public void PlaylogDetailParser_Test1()
        {
            var playlogDetail = GetPlaylogDetail("PlaylogDetail/html_test_case_1.html");
            Assert.IsNotNull(playlogDetail, "パースチェック");

            Assert.AreEqual("封焔の135秒", playlogDetail.Name, "楽曲名チェック");
            Assert.AreEqual(Difficulty.Master, playlogDetail.Difficulty, "難易度チェック");
            Assert.AreEqual(1002144, playlogDetail.Score, "スコアチェック");
            Assert.AreEqual(Rank.SS, playlogDetail.Rank, "ランクチェック");
            Assert.AreEqual(true, playlogDetail.IsClear, "クリアチェック");
            Assert.AreEqual(true, playlogDetail.IsNewRecord, "NEW RECORD チェック");
            Assert.AreEqual(ComboStatus.None, playlogDetail.ComboStatus, "コンボチェック");
            Assert.AreEqual(ChainStatus.None, playlogDetail.ChainStatus, "チェインチェック");
            Assert.AreEqual(2, playlogDetail.Track, "プレイトラックチェック");
            Assert.AreEqual(new DateTime(2021, 11, 4, 20, 52, 0), playlogDetail.PlayDate, "プレイ日時チェック");
            Assert.AreEqual("THE 3RD PLANET フレスポ八潮店", playlogDetail.StoreName, "プレイ店舗チェック");
            Assert.AreEqual("射命丸 文", playlogDetail.CharacterName, "キャラクターチェック");
            Assert.AreEqual("限界突破の証", playlogDetail.SkillName, "スキル名チェック");
            Assert.AreEqual(44, playlogDetail.SkillLevel, "スキルレベルチェック");
            Assert.AreEqual(64961, playlogDetail.SkillResult, "スキルリザルトチェック");
            Assert.AreEqual(933, playlogDetail.MaxCombo, "MAX COMBO チェック");
            Assert.AreEqual(2913, playlogDetail.JusticeCriticalCount, "JCチェック");
            Assert.AreEqual(145, playlogDetail.JusticeCount, "Jチェック");
            Assert.AreEqual(23, playlogDetail.AttackCount, "Aチェック");
            Assert.AreEqual(11, playlogDetail.MissCount, "Mチェック");
            Assert.AreEqual(99.23, playlogDetail.TapPercentage, "TAPチェック");
            Assert.AreEqual(100.99, playlogDetail.HoldPercentage, "HOLDチェック");
            Assert.AreEqual(100.99, playlogDetail.SlidePercentage, "SLIDEチェック");
            Assert.AreEqual(100.76, playlogDetail.AirPercentage, "AIRチェック");
            Assert.AreEqual(100.97, playlogDetail.FlickPercentage, "FLICKチェック");
        }

        [TestMethod]
        public void PlaylogDetailParser_Error_Test1()
        {
            var playlogDetail = GetPlaylogDetail("Common/error_page.html");
            Assert.IsNull(playlogDetail);
        }

        private PlaylogDetail GetPlaylogDetail(string path)
        {
            return new PlaylogDetailParser().Parse(TestUtility.LoadResource(path));
        }
    }
}
