using ChunithmClientLibrary;
using ChunithmClientLibrary.Core;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;

namespace ChunithmClientLibraryUnitTest.MusicData
{
    [TestClass]
    [TestCategory(TestUtility.Category.MusicData)]
    [TestCategory(TestUtility.Category.JsonIO)]
    public class MusicDataTableJsonIOTest
    {
        private ChunithmClientLibrary.Core.MusicData CreateMusicData(
            int id,
            string name,
            string genre,
            Difficulty difficulty,
            double baseRating,
            bool verified)
        {
            return new ChunithmClientLibrary.Core.MusicData
            {
                Id = id,
                Name = name,
                Genre = genre,
                Difficulty = difficulty,
                BaseRating = baseRating,
                Verified = verified,
            };
        }

        [TestMethod]
        public void MusicDataTable_JsonIO_Test1()
        {
            var expectedMusicDataTable = new MusicDataTable();
            expectedMusicDataTable.AddRange(new List<IMusicData>()
            {
                CreateMusicData(1, "TEST MUSIC 1", "POPS & ANIME", Difficulty.Basic, 1.0, false),
                CreateMusicData(1, "TEST MUSIC 1", "POPS & ANIME", Difficulty.Advanced, 3.0, false),
                CreateMusicData(1, "TEST MUSIC 1", "POPS & ANIME", Difficulty.Expert, 7.0, false),
                CreateMusicData(1, "TEST MUSIC 1", "POPS & ANIME", Difficulty.Master, 10.0, false),
            });

            var path = "MusicData/JsonIOTest/json_io_test_1.json";

            var writer = new MusicDataTableJsonWriter();
            writer.Set(expectedMusicDataTable);
            writer.Write(TestUtility.GetResourcePath(path));

            var reader = new MusicDataTableJsonReader();
            var actualMusicDataTable = reader.Read(TestUtility.LoadResource(path));

            MusicDataTestUtility.AreEqual(expectedMusicDataTable, actualMusicDataTable);
        }
    }
}
