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
            Assert.AreEqual(ScoreToOffset(1010000), 200);

            Assert.AreEqual(ScoreToOffset(1007500), 200);
            Assert.AreEqual(ScoreToOffset(1007500 - 1), 199);

            Assert.AreEqual(ScoreToOffset(1007425), 199);
            Assert.AreEqual(ScoreToOffset(1007425 - 1), 198);

            Assert.AreEqual(ScoreToOffset(1000000), 100);
            Assert.AreEqual(ScoreToOffset(1000000 - 1), 99);

            Assert.AreEqual(ScoreToOffset(999750), 99);
            Assert.AreEqual(ScoreToOffset(999750 - 1), 98);

            Assert.AreEqual(ScoreToOffset(975000), 0);
            Assert.AreEqual(ScoreToOffset(975000 - 1), -1);

            Assert.AreEqual(ScoreToOffset(974834), -1);
            Assert.AreEqual(ScoreToOffset(974834 - 1), -2);

            Assert.AreEqual(ScoreToOffset(925000), -300);
            Assert.AreEqual(ScoreToOffset(925000 - 1), -301);

            Assert.AreEqual(ScoreToOffset(924875), -301);
            Assert.AreEqual(ScoreToOffset(924875 - 1), -302);

            Assert.AreEqual(ScoreToOffset(900000), -500);
            Assert.AreEqual(ScoreToOffset(900000 - 1), -inf);
        }
    }
}
