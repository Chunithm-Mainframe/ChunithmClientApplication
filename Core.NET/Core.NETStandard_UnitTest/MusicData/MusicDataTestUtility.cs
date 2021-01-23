using ChunithmClientLibrary.Core;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ChunithmClientLibraryUnitTest.MusicData
{
    public static class MusicDataTestUtility
    {
        public static void AreEqual(IMusicDataTable expected, IMusicDataTable actual)
        {
            Assert.IsNotNull(expected, "expected");
            Assert.IsNotNull(actual, "actual");

            var expectedTableUnits = expected.MusicDatas;
            var actualTableUnits = actual.MusicDatas;
            Assert.IsNotNull(expectedTableUnits, "expected.MusicDatas");
            Assert.IsNotNull(actualTableUnits, "actual.MusicDatas");
            Assert.AreEqual(expectedTableUnits.Count, actualTableUnits.Count, "件数");

            var count = expectedTableUnits.Count;
            for (var i = 0; i < count; i++)
            {
                AreEqual(expectedTableUnits[i], actualTableUnits[i]);
            }
        }

        public static void AreEqual(IMusicData expected, IMusicData actual)
        {
            Assert.IsNotNull(expected, "expected");
            Assert.IsNotNull(actual, "actual");

            Assert.AreEqual(expected.Id, actual.Id, "楽曲ID");
            Assert.AreEqual(expected.Name, actual.Name, "楽曲名");
            Assert.AreEqual(expected.Genre, actual.Genre, "ジャンル");
            Assert.AreEqual(expected.Difficulty, actual.Difficulty, "難易度");
            Assert.AreEqual(expected.BaseRating, actual.BaseRating, "譜面定数");
            Assert.AreEqual(expected.Verified, actual.Verified, "検証");
        }
    }
}
