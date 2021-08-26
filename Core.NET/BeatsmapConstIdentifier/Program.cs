using System;
using System.Collections.Generic;
using System.Linq;

using static BeatsmapConstIdentifier._BeatsmapConstIdentifier;

namespace BeatsmapConstIdentifier
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Dump(Exec());
        }

        public static IReadOnlyCollection<Song> Exec()
        {
            return Exec(Console.ReadLine);
        }

        public static IReadOnlyCollection<Song> Exec(Func<string> readLine)
        {
            // 実運用の場合、初期化を行うのは最初の1回だけでよい
            int songNum = GetSongNum(readLine); // 総曲数(曲IDの最大値)の取得

            var instance = new _BeatsmapConstIdentifier(songNum);

            instance.AddSong(new Song(-1, -2)); // 曲ID0番に、無効なデータを番兵として置く
            instance.AddSongs(Enumerable.Range(0, songNum).Select(_ => ReadSongData(readLine)));

            var setDatas = new List<SetData>();
            var oneDatas = new List<OneData>();

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
                    setDatas.Add(setData);
                }
                // ある曲について、制約を追加
                if (s == "One")
                {
                    var oneData = ReadOneData(readLine);
                    oneDatas.Add(oneData);
                }
            }

            foreach (var oneData in oneDatas)
            {
                if (!instance.AddOneData(oneData))
                {
                    // データがどこかで破損している
                    Console.WriteLine("Error : Crashed!!");
                    return Array.Empty<Song>();
                }
            }

            foreach (var setData in setDatas)
            {
                if (!instance.AddSetData(setData))
                {
                    // データがどこかで破損している
                    Console.WriteLine("Error : Crashed!!");
                    return Array.Empty<Song>();
                }
            }

            return instance.Songs.Skip(1).ToArray();
        }

        // 最終結果の出力
        public static void Dump(IEnumerable<Song> songs)
        {
            foreach (var (song, id) in songs.Select((x, i) => (x, i + 1)))
            {
                Console.WriteLine($"{id}:[{song.LowerLimit},{song.UpperLimit}]");
            }
        }

        // 総曲数(曲IDの最大値)を取得
        // もし4難易度全てについて調べるなら、収録曲数の4倍必要
        public static int GetSongNum(Func<string> readLine)
        {
            var res = int.Parse(readLine());
            return res;
        }

        public static Song ReadSongData(Func<string> readLine)
        {
            var inputData = new Song();
            var read = readLine().Split(' ');
            inputData.LowerLimit = int.Parse(read[0]);
            inputData.UpperLimit = int.Parse(read[1]);
            return inputData;
        }

        public static OneData ReadOneData(Func<string> readLine)
        {
            var inputData = new OneData();
            var read = readLine().Split(' ');
            inputData.Id = int.Parse(read[0]);
            inputData.LowerLimit = int.Parse(read[1]);
            inputData.UpperLimit = int.Parse(read[2]);
            return inputData;
        }

        public static SetData ReadSetData(Func<string> readLine)
        {
            var inputData = new SetData();
            var songCount = int.Parse(readLine());
            for (var i = 0; i < songCount; i++)
            {
                var (inid, insc) = ReadSetDataUnit(readLine);
                if (insc < 0)
                {
                    // Sに満たない、オフセット 0 未満ならデータを破棄
                    continue;
                }
                inputData.SongIds.Add(inid);
                inputData.Offsets.Add(insc);
            }

            return inputData;
        }

        public static (int inid, int insc) ReadSetDataUnit(Func<string> readLine)
        {
            var line = readLine().Split(' ');
            var inid = int.Parse(line[0]);
            var insc = int.Parse(line[1]);
            insc = ScoreToOffset(insc); // スコアをオフセットに変換
            return (inid, insc);
        }
    }
}
