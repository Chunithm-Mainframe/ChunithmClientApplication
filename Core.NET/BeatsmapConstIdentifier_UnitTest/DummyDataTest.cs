using BeatsmapConstIdentifier;
using ChunithmClientLibrary;
using ChunithmClientLibrary.Core;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using Core = ChunithmClientLibrary.Core;
using MusicRating = BeatsmapConstIdentifier.MusicRating;

namespace BeatsmapConstIdentifier_UnitTest
{
    [TestClass]
    public class DummyDataTest
    {
        public void TestFile(string inputFileName, string outputFileName)
        {
            Console.WriteLine($"{nameof(TestFile)}({inputFileName}, {outputFileName})");

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

            diffs.ForEach(Console.WriteLine);

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
        public void Test1()
        {
            (bool success, IReadOnlyList<MusicRating> musics) Run(MusicRepository repository, RatingRecordContainer container)
            {
                var input = new RunnerInput();
                input.SetMusicRepository(repository);
                input.AddRatingRecordContainer(container);
                return Runner.Run(input);
            }

            const double expected1 = 12.0;
            const double expected2 = 11.5;

            void Compare(IReadOnlyList<MusicRating> musics, (int lowerLimit, int upperLimit) x1, (int lowerLimit, int upperLimit) x2)
            {
                Assert.AreEqual(x1.lowerLimit == x1.upperLimit, musics[0].Established);
                Assert.AreEqual(x1.lowerLimit, musics[0].LowerLimit);
                Assert.AreEqual(x1.upperLimit, musics[0].UpperLimit);

                Assert.AreEqual(x2.lowerLimit == x2.upperLimit, musics[1].Established);
                Assert.AreEqual(x2.lowerLimit, musics[1].LowerLimit);
                Assert.AreEqual(x2.upperLimit, musics[1].UpperLimit);
            }

            var masterMusics = new List<MasterMusic>
            {
                new MasterMusic(1, string.Empty, string.Empty),
                new MasterMusic(2, string.Empty, string.Empty),
                new MasterMusic(3, string.Empty, string.Empty),
                new MasterMusic(4, string.Empty, string.Empty),
            };

            var musicRatings = new List<Core.MusicRating>()
            {
                new Core.MusicRating(1, Difficulty.Invalid, Music.GetRangeBaseRating(expected1).lowerLimit, false),
                new Core.MusicRating(2, Difficulty.Invalid, Music.GetRangeBaseRating(expected2).lowerLimit, false),
                new Core.MusicRating(3, Difficulty.Invalid, 11.5, true),
                new Core.MusicRating(4, Difficulty.Invalid, 11.0, false),
            };

            var musicRepository = new MusicRepository(masterMusics, musicRatings);

            var ratingRecordContainer = new RatingRecordContainer();
            {
                // 変動なし

                ratingRecordContainer.Records.Clear();
                ratingRecordContainer.Records.Add(new RatingRecordContainer.Reocrd(1, Difficulty.Invalid, 1000000));
                ratingRecordContainer.Records.Add(new RatingRecordContainer.Reocrd(2, Difficulty.Invalid, 1005000));

                var (success, musics) = Run(musicRepository, ratingRecordContainer);
                Assert.AreEqual(true, success);
                Compare(musics, (1200, 1260), (1100, 1160));
            }
            {
                // ID 1 の確定

                ratingRecordContainer.Records.Clear();
                ratingRecordContainer.Records.Add(new RatingRecordContainer.Reocrd(1, Difficulty.Invalid, 1000000));
                ratingRecordContainer.Records.Add(new RatingRecordContainer.Reocrd(3, Difficulty.Invalid, 1005000));
                ratingRecordContainer.Records.Add(new RatingRecordContainer.Reocrd(1, Difficulty.Invalid, 999999));

                var (success, musics) = Run(musicRepository, ratingRecordContainer);
                Assert.AreEqual(true, success);
                Compare(musics, (1200, 1200), (1100, 1160));
            }
            {
                // 値域の更新テスト1

                ratingRecordContainer.Records.Clear();
                ratingRecordContainer.Records.Add(new RatingRecordContainer.Reocrd(1, Difficulty.Invalid, 1000000));
                ratingRecordContainer.Records.Add(new RatingRecordContainer.Reocrd(2, Difficulty.Invalid, 1005000));
                ratingRecordContainer.Records.Add(new RatingRecordContainer.Reocrd(1, Difficulty.Invalid, 999999));

                var (success, musics) = Run(musicRepository, ratingRecordContainer);
                Assert.AreEqual(true, success);
                Compare(musics, (1200, 1210), (1150, 1160));
            }
            {
                // 値域の更新テスト2

                ratingRecordContainer.Records.Clear();
                ratingRecordContainer.Records.Add(new RatingRecordContainer.Reocrd(4, Difficulty.Invalid, 1004500));
                ratingRecordContainer.Records.Add(new RatingRecordContainer.Reocrd(1, Difficulty.Invalid, 1000000));
                ratingRecordContainer.Records.Add(new RatingRecordContainer.Reocrd(2, Difficulty.Invalid, 1005000));
                ratingRecordContainer.Records.Add(new RatingRecordContainer.Reocrd(1, Difficulty.Invalid, 999999));

                var (success, musics) = Run(musicRepository, ratingRecordContainer);
                Assert.AreEqual(true, success);
                Compare(musics, (1200, 1200), (1150, 1150));
            }
        }
    }
}
