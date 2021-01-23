using ChunithmClientLibrary;
using ChunithmClientLibrary.Core;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;

namespace ChunithmClientLibraryUnitTest.MusicData
{
    [TestClass]
    [TestCategory(TestUtility.Category.XmlIO)]
    [TestCategory(TestUtility.Category.MusicData)]
    public class MusicDataTableXmlIOTest
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
        public void MusicDataTable_XmlIO_Test1()
        {
            var expectedMusicDataTable = new MusicDataTable();
            expectedMusicDataTable.AddRange(new List<IMusicData>()
            {
                CreateMusicData(1, "TEST MUSIC 1", "POPS & ANIME", Difficulty.Basic, 1.0, false),
                CreateMusicData(1, "TEST MUSIC 1", "POPS & ANIME", Difficulty.Advanced, 3.0, false),
                CreateMusicData(1, "TEST MUSIC 1", "POPS & ANIME", Difficulty.Expert, 7.0, false),
                CreateMusicData(1, "TEST MUSIC 1", "POPS & ANIME", Difficulty.Master, 10.0, false),
            });

            var path = "MusicData/XMLIOTest/xml_io_test_1.xlsx";

            var writer = new MusicDataTableXmlWriter();
            writer.Set(expectedMusicDataTable);
            writer.Write(TestUtility.GetResourcePath(path));

            var reader = new MusicDataTableXmlReader();
            var actualMusicDataTable = reader.Read(TestUtility.GetResourcePath(path));

            MusicDataTestUtility.AreEqual(expectedMusicDataTable, actualMusicDataTable);
        }
    }
}
