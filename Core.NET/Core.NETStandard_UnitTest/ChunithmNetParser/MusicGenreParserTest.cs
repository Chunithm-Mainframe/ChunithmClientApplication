using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmNet.Parser;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using static ChunithmClientLibrary.ChunithmNet.Data.MusicGenre;

namespace ChunithmClientLibraryUnitTest.ChunithmNetParser
{
    [TestClass]
    [TestCategory(TestUtility.Category.ChunithmNetParser)]
    public class MusicGenreParserTest
    {
        [TestMethod]
        public void MusicGenreParser_Test1()
        {
            var musicGenre = new MusicGenreParser().Parse(TestUtility.LoadResource("MusicGenre/html_test_case_1.html"));
            Assert.IsNotNull(musicGenre, "パースチェック");

            Assert.AreEqual(118, musicGenre.MusicCount, "楽曲数");
            Assert.AreEqual(105, musicGenre.ClearCount, "クリア 楽曲数");
            Assert.AreEqual(105, musicGenre.SCount, "S 楽曲数");
            Assert.AreEqual(104, musicGenre.SaCount, "S+ 楽曲数");
            Assert.AreEqual(104, musicGenre.SsCount, "SS 楽曲数");
            Assert.AreEqual(104, musicGenre.SsaCount, "SS+ 楽曲数");
            Assert.AreEqual(104, musicGenre.SssCount, "SSS 楽曲数");
            Assert.AreEqual(100, musicGenre.SssaCount, "SSS+ 楽曲数");
            Assert.AreEqual(101, musicGenre.FullComboCount, "フルコンボ 楽曲数");
            Assert.AreEqual(99, musicGenre.AllJusticeCount, "AJ 楽曲数");
            Assert.AreEqual(3, musicGenre.FullChainGoldCount, "フルチェイン(金) 楽曲数");
            Assert.AreEqual(3, musicGenre.FullChainPlatinumCount, "フルチェイン 楽曲数");

            var units = musicGenre.Units;
            Assert.AreEqual(118, units.Length, "件数チェック");
            {
                AssertUnit(
                    units[0],
                    2141,
                    "永遠のAria",
                    "POPS & ANIME",
                    Difficulty.Master,
                    0,
                    Rank.None,
                    false,
                    ComboStatus.None,
                    ChainStatus.None);
            }
            {
                AssertUnit(
                    units[8],
                    2012,
                    "紅",
                    "POPS & ANIME",
                    Difficulty.Master,
                    988987,
                    Rank.S,
                    true,
                    ComboStatus.None,
                    ChainStatus.None);
            }
            {
                AssertUnit(
                    units[15],
                    2088,
                    "乙女のルートはひとつじゃない！",
                    "POPS & ANIME",
                    Difficulty.Master,
                    1009967,
                    Rank.SSSA,
                    true,
                    ComboStatus.AllJustice,
                    ChainStatus.None);
            }
        }

        [TestMethod]
        public void MusicGenreParser_Test2()
        {
            var musicGenre = new MusicGenreParser().Parse(TestUtility.LoadResource("MusicGenre/html_test_case_2.html"));
            Assert.IsNotNull(musicGenre, "パースチェック");

            Assert.AreEqual(188, musicGenre.MusicCount, "楽曲数");
            Assert.AreEqual(172, musicGenre.ClearCount, "クリア 楽曲数");
            Assert.AreEqual(172, musicGenre.SCount, "S 楽曲数");
            Assert.AreEqual(172, musicGenre.SaCount, "S+ 楽曲数");
            Assert.AreEqual(172, musicGenre.SsCount, "SS 楽曲数");
            Assert.AreEqual(172, musicGenre.SsaCount, "SS+ 楽曲数");
            Assert.AreEqual(172, musicGenre.SssCount, "SSS 楽曲数");
            Assert.AreEqual(162, musicGenre.SssaCount, "SSS+ 楽曲数");
            Assert.AreEqual(169, musicGenre.FullComboCount, "フルコンボ 楽曲数");
            Assert.AreEqual(152, musicGenre.AllJusticeCount, "AJ 楽曲数");
            Assert.AreEqual(2, musicGenre.FullChainGoldCount, "フルチェイン(金) 楽曲数");
            Assert.AreEqual(2, musicGenre.FullChainPlatinumCount, "フルチェイン 楽曲数");

            var units = musicGenre.Units;
            Assert.AreEqual(188, units.Length, "件数チェック");
            {
                AssertUnit(
                    units[0],
                    2017,
                    "ヴィラン",
                    "niconico",
                    Difficulty.Master,
                    0,
                    Rank.None,
                    false,
                    ComboStatus.None,
                    ChainStatus.None);
            }
            {
                AssertUnit(
                    units[154],
                    211,
                    "天樂",
                    "niconico",
                    Difficulty.Master,
                    1009937,
                    Rank.SSSA,
                    true,
                    ComboStatus.AllJustice,
                    ChainStatus.FullChainPlatinum);
            }
        }

        private static void AssertUnit(
            Unit unit,
            int id,
            string name,
            string genre,
            Difficulty difficulty,
            int score,
            Rank rank,
            bool isClear,
            ComboStatus comboStatus,
            ChainStatus chainStatus)
        {
            Assert.IsNotNull(unit);
            Assert.AreEqual(id, unit.Id, "ID");
            Assert.AreEqual(name, unit.Name, "楽曲名");
            Assert.AreEqual(genre, unit.Genre, "ジャンル");
            Assert.AreEqual(difficulty, unit.Difficulty, "難易度");
            Assert.AreEqual(score, unit.Score, "スコア");
            Assert.AreEqual(rank, unit.Rank, "ランク");
            Assert.AreEqual(isClear, unit.IsClear, "クリア");
            Assert.AreEqual(comboStatus, unit.ComboStatus, "コンボランプ");
            Assert.AreEqual(chainStatus, unit.ChainStatus, "チェインランプ");
        }

        [TestMethod]
        public void MusicGenreParser_Error_Test1()
        {
            var musicGenre = new MusicGenreParser().Parse(TestUtility.LoadResource("Common/error_page.html"));
            Assert.IsNull(musicGenre);
        }
    }
}
