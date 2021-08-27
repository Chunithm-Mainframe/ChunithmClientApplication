using Microsoft.VisualStudio.TestTools.UnitTesting;

using static BeatsmapConstIdentifier._BeatsmapConstIdentifier;

namespace BeatsmapConstIdentifier_UnitTest
{
    [TestClass]
    public class ScoreToOffsetTest
    {
        [TestMethod]
        public void Test1()
        {
            Assert.AreEqual(200, ScoreToOffset(1010000));

            Assert.AreEqual(200, ScoreToOffset(1007500));
            Assert.AreEqual(199, ScoreToOffset(1007500 - 1));

            Assert.AreEqual(199, ScoreToOffset(1007450));
            Assert.AreEqual(198, ScoreToOffset(1007450 - 1));

            Assert.AreEqual(150, ScoreToOffset(1005000));
            Assert.AreEqual(149, ScoreToOffset(1004999));

            Assert.AreEqual(149, ScoreToOffset(1004900));
            Assert.AreEqual(148, ScoreToOffset(1004900 - 1));

            Assert.AreEqual(100, ScoreToOffset(1000000));
            Assert.AreEqual(99, ScoreToOffset(1000000 - 1));

            Assert.AreEqual(99, ScoreToOffset(999750));
            Assert.AreEqual(98, ScoreToOffset(999750 - 1));

            Assert.AreEqual(0, ScoreToOffset(975000));
            Assert.AreEqual(-1, ScoreToOffset(975000 - 1));

            Assert.AreEqual(-1, ScoreToOffset(974834));
            Assert.AreEqual(-2, ScoreToOffset(974834 - 1));

            Assert.AreEqual(-300, ScoreToOffset(925000));
            Assert.AreEqual(-301, ScoreToOffset(925000 - 1));

            Assert.AreEqual(-301, ScoreToOffset(924875));
            Assert.AreEqual(-302, ScoreToOffset(924875 - 1));

            Assert.AreEqual(-500, ScoreToOffset(900000));
            Assert.AreEqual(-inf, ScoreToOffset(900000 - 1));
        }
    }
}
