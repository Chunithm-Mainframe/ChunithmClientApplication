using System;
using System.Collections.Generic;

namespace BeatsmapConstIdentifier
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Exec();
        }

        private static void Exec()
        {
            // 実運用の場合、初期化を行うのは最初の1回だけでよい
            int SongNum = _BeatsmapConstIdentifier.GetSongNum(); // 総曲数(曲IDの最大値)の取得

            var instance = new _BeatsmapConstIdentifier();

            instance.ConstIneq = new List<(int first, int second)>(SongNum + 1);
            instance.RelateSong = new List<HashSet<int>>(SongNum + 1);
            instance.ConstIneq.Add((-1, -2)); // 曲ID0番に、無効なデータを番兵として置く

            for (int i = 1; i <= SongNum; i++)
            {
                var songData = ReadSongData();
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
                    s = Console.ReadLine();
                    if (s == "Set" || s == "One" || s == "No") { break; }
                    Console.WriteLine("Error : Input should be Set / One / No (Case-sensitive)");
                }
                if (s == "No") { break; }
                // Best枠かRecent枠のデータを、1個分取得する
                if (s == "Set")
                {
                    var setData = ReadSetData();
                    if (!instance.AddSetData(setData))
                    {
                        // データがどこかで破損している
                        Console.WriteLine("Error : Crashed!!");
                        return;
                    }
                }
                // ある曲について、制約を追加
                if (s == "One")
                {
                    var oneData = ReadOneData();
                    if (!instance.AddOneData(oneData))
                    {
                        // データがどこかで破損している
                        Console.WriteLine("Error : Crashed!!");
                        return;
                    }
                }
            }

            // 終了処理
            for (int i = 1; i <= SongNum; i++)
            {
                // 最終結果の出力
                Console.WriteLine($"{i}:[{instance.ConstIneq[i].first},{instance.ConstIneq[i].second}]");
            }
            return;
        }

        public static _BeatsmapConstIdentifier.SongData ReadSongData()
        {
            var inputData = new _BeatsmapConstIdentifier.SongData();
            inputData.fir = int.Parse(Console.ReadLine());
            inputData.sec = int.Parse(Console.ReadLine());
            return inputData;
        }

        public static _BeatsmapConstIdentifier.OneData ReadOneData()
        {
            var inputData = new _BeatsmapConstIdentifier.OneData();
            inputData.id = int.Parse(Console.ReadLine());
            inputData.first = int.Parse(Console.ReadLine());
            inputData.second = int.Parse(Console.ReadLine());
            return inputData;
        }

        public static _BeatsmapConstIdentifier.SetData ReadSetData()
        {
            var inputData = new _BeatsmapConstIdentifier.SetData();
            inputData.SetSong = int.Parse(Console.ReadLine());
            for (var i = 0; i < inputData.SetSong; i++)
            {
                var inid = int.Parse(Console.ReadLine());
                var insc = int.Parse(Console.ReadLine());
                insc = _BeatsmapConstIdentifier.ScoreToOffset(insc); // スコアをオフセットに変換
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
    }
}
