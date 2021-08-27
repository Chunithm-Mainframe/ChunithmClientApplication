using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;

namespace BeatsmapConstIdentifier_UnitTest
{
    [TestClass]
    public class DummyDataTest
    {
        public void TestFile(string inputFileName, string outputFileName)
        {
            System.Console.WriteLine($"{nameof(TestFile)}({inputFileName}, {outputFileName})");

            var actuals = TestUtility.TestFile(inputFileName).ToArray();
            var expecteds = TestUtility.ReadResourceFileLines(outputFileName).Select(x => int.Parse(x)).ToArray();
            Assert.IsTrue(actuals.Any());
            Assert.AreEqual(actuals.Length, expecteds.Length);

            var diffs = actuals.Zip(expecteds)
                .Select((x, index) => (actual: x.First, expected: x.Second, lineNumber: index + 1))
                .Where(x => x.actual.Established
                    ? x.actual.LowerLimit != x.expected
                    : !(x.actual.LowerLimit <= x.expected && x.expected <= x.actual.UpperLimit))
                .Select(x => $"{x.lineNumber}\nexpected: {x.expected}\nactual: {x.actual}\n")
                .ToList();

            diffs.ForEach(System.Console.WriteLine);

            Assert.IsTrue(!diffs.Any());
        }

        [TestMethod]
        public void TestFiles()
        {
            var testCount = 11;
            var testFileNamePairs = Enumerable.Range(1, testCount)
                .Select(x => (input: string.Format("input{0:D2}.txt", x), output: string.Format("output{0:D2}.txt", x)))
                .ToArray();

            foreach (var testFileNamePair in testFileNamePairs)
            {
                TestFile(testFileNamePair.input, testFileNamePair.output);
            }
        }

        [TestMethod]
        public void Test_Error1()
        {
            var outputs = TestUtility.TestFile("input_error_01.txt");
            Assert.IsFalse(outputs.Any());
        }
    }
}
