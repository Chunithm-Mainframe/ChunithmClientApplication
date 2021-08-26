using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace BeatsmapConstIdentifier
{
    public class Program
    {
        public static void Main(string[] args)
        {
        }

        public static Func<string> CreateReadLineFile(string path)
        {
            using var reader = new StreamReader(path);
            var lines = reader.ReadToEnd().Replace("\r\n", "\n").Split("\n", StringSplitOptions.RemoveEmptyEntries);
            return CreateReadLine(lines.AsEnumerable().GetEnumerator());
        }

        public static Func<string> CreateReadLine(IEnumerator<string> lines)
        {
            return () =>
            {
                lines.MoveNext();
                return lines.Current;
            };
        }

        public static IReadOnlyCollection<string> Exec()
        {
            return Exec(Console.ReadLine);
        }

        public static IReadOnlyCollection<string> Exec(Func<string> readLine)
        {
            // 実運用の場合、初期化を行うのは最初の1回だけでよい
            int SongNum = GetSongNum(readLine); // 総曲数(曲IDの最大値)の取得

            var instance = new _BeatsmapConstIdentifier();

            instance.ConstIneq = Enumerable.Repeat<(int first, int second)>(default, SongNum + 1).ToList();
            instance.RelateSong = Enumerable.Repeat(new HashSet<int>(), SongNum + 1).ToList();
            instance.ConstIneq[0] = (-1, -2); // 曲ID0番に、無効なデータを番兵として置く

            for (int i = 1; i <= SongNum; i++)
            {
                var songData = ReadSongData(readLine);
                instance.AddSongData(i, songData); // 曲IDがi番の曲について、筐体表示レベルを入力
            }

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
                    var setData = ReadSetData(readLine);
                    if (!instance.AddSetData(setData))
                    {
                        // データがどこかで破損している
                        Console.WriteLine("Error : Crashed!!");
                        return Array.Empty<string>();
                    }
                }
                // ある曲について、制約を追加
                if (s == "One")
                {
                    var oneData = ReadOneData(readLine);
                    if (!instance.AddOneData(oneData))
                    {
                        // データがどこかで破損している
                        Console.WriteLine("Error : Crashed!!");
                        return Array.Empty<string>();
                    }
                }
            }

            // 終了処理
            var outputs = Enumerable.Range(1, SongNum)
                .Select(x => $"{x}:[{instance.ConstIneq[x].first},{instance.ConstIneq[x].second}]")
                .ToArray();

            foreach (var output in outputs)
            {
                // 最終結果の出力
                Console.WriteLine(output);
            }

            return outputs;
        }

        // 総曲数(曲IDの最大値)を取得
        // もし4難易度全てについて調べるなら、収録曲数の4倍必要
        public static int GetSongNum(Func<string> readLine)
        {
            var res = int.Parse(readLine());
            return res;
        }

        public static _BeatsmapConstIdentifier.SongData ReadSongData(Func<string> readLine)
        {
            var inputData = new _BeatsmapConstIdentifier.SongData();
            var read = readLine().Split(' ');
            inputData.fir = int.Parse(read[0]);
            inputData.sec = int.Parse(read[1]);
            return inputData;
        }

        public static _BeatsmapConstIdentifier.OneData ReadOneData(Func<string> readLine)
        {
            var inputData = new _BeatsmapConstIdentifier.OneData();
            var read = readLine().Split(' ');
            inputData.id = int.Parse(read[0]);
            inputData.first = int.Parse(read[1]);
            inputData.second = int.Parse(read[2]);
            return inputData;
        }

        public static _BeatsmapConstIdentifier.SetData ReadSetData(Func<string> readLine)
        {
            var inputData = new _BeatsmapConstIdentifier.SetData();
            inputData.SetSong = int.Parse(readLine());
            for (var i = 0; i < inputData.SetSong; i++)
            {
                var (inid, insc) = ReadSetDataUnit(readLine);
                if (insc < 0)
                {
                    // Sに満たない、オフセット 0 未満ならデータを破棄
                    continue;
                }
                inputData.Songid.Add(inid);
                inputData.Offset.Add(insc);
            }
            inputData.SetSong = inputData.Songid.Count; // 有効なデータが何曲あるかに更新

            return inputData;
        }

        public static (int inid, int insc) ReadSetDataUnit(Func<string> readLine)
        {
            var line = readLine().Split(' ');
            var inid = int.Parse(line[0]);
            var insc = int.Parse(line[1]);
            insc = _BeatsmapConstIdentifier.ScoreToOffset(insc); // スコアをオフセットに変換
            return (inid, insc);
        }
    }
}
