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
                instance.InitSongLevel(i); // 曲IDがi番の曲について、筐体表示レベルを入力
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
                    if (!instance.InputSetData())
                    {
                        // データがどこかで破損している
                        Console.WriteLine("Error : Crashed!!");
                        return;
                    }
                }
                // ある曲について、制約を追加
                if (s == "One")
                {
                    if (!instance.InputOneData())
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
    }
}
