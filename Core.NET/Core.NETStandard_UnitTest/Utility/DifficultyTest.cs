using ChunithmClientLibrary;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ChunithmClientLibraryUnitTest
{
    [TestClass]
    [TestCategory(TestUtility.Category.Utility)]
    public class DifficultyTest
    {
        [TestMethod]
        public void Difficulty_DifficultyToDifficultyText_Test1()
        {
            Assert.AreEqual("BASIC", Utility.ToDifficultyText(Difficulty.Basic), "BASIC");
            Assert.AreEqual("ADVANCED", Utility.ToDifficultyText(Difficulty.Advanced), "ADVANCED");
            Assert.AreEqual("EXPERT", Utility.ToDifficultyText(Difficulty.Expert), "EXPERT");
            Assert.AreEqual("MASTER", Utility.ToDifficultyText(Difficulty.Master), "MASTER");
            Assert.AreEqual("ULTIMA", Utility.ToDifficultyText(Difficulty.Ultima), "ULTIMA");
            Assert.AreEqual("WORLD'S END", Utility.ToDifficultyText(Difficulty.WorldsEnd), "WORLD'S END");
            Assert.AreEqual("INVALID", Utility.ToDifficultyText(Difficulty.Invalid), "INVALID");

            Assert.AreEqual("INVALID", Utility.ToDifficultyText((Difficulty)(-1)), "INVALID");
            Assert.AreEqual("INVALID", Utility.ToDifficultyText((Difficulty)10), "INVALID");
        }

        [TestMethod]
        public void Difficulty_DifficutlyTextToDifficulty_Test1()
        {
            Assert.AreEqual(Difficulty.Basic, Utility.ToDifficulty("BASIC"), "BASIC");
            Assert.AreEqual(Difficulty.Advanced, Utility.ToDifficulty("ADVANCED"), "ADVANCED");
            Assert.AreEqual(Difficulty.Expert, Utility.ToDifficulty("EXPERT"), "EXPERT");
            Assert.AreEqual(Difficulty.Master, Utility.ToDifficulty("MASTER"), "MASTER");
            Assert.AreEqual(Difficulty.Ultima, Utility.ToDifficulty("ULTIMA"), "ULTIMA");
            Assert.AreEqual(Difficulty.WorldsEnd, Utility.ToDifficulty("WORLD'S END"), "WORLD'S END");
            Assert.AreEqual(Difficulty.Invalid, Utility.ToDifficulty("INVALID"), "INVALID");

            Assert.AreEqual(Difficulty.Invalid, Utility.ToDifficulty(null), "INVALID");
            Assert.AreEqual(Difficulty.Invalid, Utility.ToDifficulty(""), "INVALID");
            Assert.AreEqual(Difficulty.Invalid, Utility.ToDifficulty("Basic"), "INVALID");
            Assert.AreEqual(Difficulty.Invalid, Utility.ToDifficulty("basic"), "INVALID");
            Assert.AreEqual(Difficulty.Invalid, Utility.ToDifficulty("Advanced"), "INVALID");
            Assert.AreEqual(Difficulty.Invalid, Utility.ToDifficulty("advanced"), "INVALID");
            Assert.AreEqual(Difficulty.Invalid, Utility.ToDifficulty("Expert"), "INVALID");
            Assert.AreEqual(Difficulty.Invalid, Utility.ToDifficulty("expert"), "INVALID");
            Assert.AreEqual(Difficulty.Invalid, Utility.ToDifficulty("Master"), "INVALID");
            Assert.AreEqual(Difficulty.Invalid, Utility.ToDifficulty("master"), "INVALID");
            Assert.AreEqual(Difficulty.Invalid, Utility.ToDifficulty("World's end"), "INVALID");
            Assert.AreEqual(Difficulty.Invalid, Utility.ToDifficulty("world's end"), "INVALID");
        }
    }
}
