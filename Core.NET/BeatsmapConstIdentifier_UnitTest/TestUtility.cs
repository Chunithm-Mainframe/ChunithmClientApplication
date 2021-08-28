using BeatsmapConstIdentifier;
using ChunithmClientLibrary;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace BeatsmapConstIdentifier_UnitTest
{
    public static class TestUtility
    {
        public static string ToResourcePath(string fileName)
        {
            return "../../../Resources/" + fileName;
        }

        public static string[] ReadFileLines(string path)
        {
            using var reader = new StreamReader(path);
            return reader.ReadToEnd().Replace("\r\n", "\n").Split("\n", StringSplitOptions.RemoveEmptyEntries);
        }

        public static string[] ReadResourceFileLines(string fileName)
        {
            return ReadFileLines(ToResourcePath(fileName));
        }

        public static Func<string> CreateReadLine(IEnumerator<string> lines)
        {
            return () =>
            {
                lines.MoveNext();
                return lines.Current;
            };
        }

        public static IReadOnlyCollection<MusicRating> TestFile(string fileName)
        {
            return Exec(CreateReadLine(ReadResourceFileLines(fileName).AsEnumerable().GetEnumerator()));
        }

        public static IReadOnlyCollection<MusicRating> Exec()
        {
            return Exec(Console.ReadLine);
        }

        public static IReadOnlyCollection<MusicRating> Exec(Func<string> readLine)
        {
            // 実運用の場合、初期化を行うのは最初の1回だけでよい
            int musicNum = GetMusicNum(readLine); // 総曲数(曲IDの最大値)の取得

            var musics = new List<MusicRating>();
            Enumerable.Range(1, musicNum)
                .Select(id => ReadMusicData(id, readLine))
                .ToList()
                .ForEach(musics.Add);

            var ratingRecordContainers = new List<RatingRecordContainer>();
            var oneDatas = new List<MusicRating>();

            // Best枠 (Recent枠) 情報入力ゾーン
            // 旧バージョンの状態の各枠を間違って取り込まないよう、注意!
            // (直近プレイ記録の最新プレイ時刻とかで判定してください)
            while (true)
            {
                // 標準入力から Set/One/No 入力 (Case-sensitive)
                // "Set" ... 枠の情報を入力する
                // "One" ... ある曲の定数の情報を入力する
                // "No" ... 終わる
                string s;
                while (true)
                {
                    s = readLine();
                    if (s == "Set" || s == "One" || s == "No") { break; }
                    Console.WriteLine("Error : Input should be Set / One / No (Case-sensitive)");
                }
                if (s == "No") { break; }
                // Best枠かRecent枠のデータを、1個分取得する
                if (s == "Set")
                {
                    ratingRecordContainers.Add(ReadRatingRecordContainer(readLine));
                }
                // ある曲について、制約を追加
                if (s == "One")
                {
                    oneDatas.Add(ReadOneData(readLine));
                }
            }

            return Exec(musics, oneDatas, ratingRecordContainers);
        }

        public static IReadOnlyCollection<MusicRating> Exec(IReadOnlyList<MusicRating> musics, IReadOnlyList<MusicRating> oneDatas, IReadOnlyList<RatingRecordContainer> ratingRecordContainers)
        {
            var input = new RunnerInput();

            input.AddMusics(musics);
            input.AddMusics(oneDatas);
            input.AddRatingRecordContainers(ratingRecordContainers);

            var result = Runner.Run(input);

            if (!result.success)
            {
                // データがどこかで破損している
                Console.WriteLine("Error : Crashed!!");
            }

            return result.musics;
        }

        // 最終結果の出力
        public static void Dump(IEnumerable<MusicRating> musics)
        {
            foreach (var music in musics)
            {
                Console.WriteLine($"{music.Id}:[{music.LowerLimit},{music.UpperLimit}]");
            }
        }

        // 総曲数(曲IDの最大値)を取得
        // もし4難易度全てについて調べるなら、収録曲数の4倍必要
        public static int GetMusicNum(Func<string> readLine)
        {
            var res = int.Parse(readLine());
            return res;
        }

        public static MusicRating ReadMusicData(int id, Func<string> readLine)
        {
            var read = readLine().Split(' ');
            return new MusicRating(id, Difficulty.Invalid, int.Parse(read[0]), int.Parse(read[1]));
        }

        public static MusicRating ReadOneData(Func<string> readLine)
        {
            var read = readLine().Split(' ');
            return new MusicRating(
                int.Parse(read[0]),
                Difficulty.Invalid,
                int.Parse(read[1]),
                int.Parse(read[2]));
        }

        public static RatingRecordContainer ReadRatingRecordContainer(Func<string> readLine)
        {
            var inputData = new RatingRecordContainer();
            var musicCount = int.Parse(readLine());
            for (var i = 0; i < musicCount; i++)
            {
                var record = ReadRatingRecord(readLine);
                if (record.Offset >= 0)
                {
                    inputData.Records.Add(record);
                }
            }

            return inputData;
        }

        public static RatingRecordContainer.Reocrd ReadRatingRecord(Func<string> readLine)
        {
            var line = readLine().Split(' ');
            return new RatingRecordContainer.Reocrd(
                int.Parse(line[0]),
                Difficulty.Invalid,
                int.Parse(line[1]));
        }
    }
}
