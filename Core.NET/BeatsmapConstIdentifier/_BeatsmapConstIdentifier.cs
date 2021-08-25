using System;
using System.Collections.Generic;
using System.Linq;

namespace BeatsmapConstIdentifier
{
    // Beatsmap Const Identifier
    // 譜面定数特定機
    // Written by : physics0523
    // Translated by : MAX-eipi

    // 【重要】譜面定数は100倍した形で使用するので、注意
    // Ex) 13.7 -> 1370
    // 譜面定数に小数第3位が導入されたら詰む?知らんな...
    // さらに、このコードでは譜面定数の小数第2位は存在しないものとする
    // 仮にするようになった場合、physics0523が修正します。多分。
    // 最悪、空間計算量を O(曲数 ^ 2) くらい食います。曲数が5000とかになるとせぐふぉするかも。

    public class _BeatsmapConstIdentifier
    {
        public class SongData
        {
            public int fir;
            public int sec;
        }

        public class SetData
        {
            public int SetSong;

            public List<int> Songid = new List<int>();
            public List<int> Offset = new List<int>();
        }

        public class OneData
        {
            public int id;
            public int first;
            public int second;
        }

        // 十分大きな値として inf を定義
        public const int inf = 1000000007;

        // ConstIneq[ 曲ID ] : pair<int,int> の vector
        // .first <= (曲IDの譜面定数) <= .second
        public List<(int first, int second)> ConstIneq;

        // RelateSong[ 曲ID ] : set<int> の vector
        // RelateSong[ i ] の要素 = (曲ID i)と何らかの関係式が存在する曲IDの集合
        public List<HashSet<int>> RelateSong;

        // ReqMin[ (曲ID : s , 曲ID : t) ] = {数値v} の、
        // keyが pair<int,int> であり value が int である map
        // 「 (tの譜面定数) >= (sの譜面定数) + v 」(vが負になる可能性もある)
        // 最も緩い制約は、v=-inf
        public Dictionary<(int id1, int id2), int> ReqMin;

        // ReqMax[ (曲ID : s , 曲ID : t) ] = {数値v} の、
        // keyが pair<int,int> であり value が int である map
        // 「 (tの譜面定数) <= (sの譜面定数) + v 」(vが負になる可能性もある)
        // 最も緩い制約は、v=inf
        public Dictionary<(int id1, int id2), int> ReqMax;

        // 譜面定数が小数第1位までしか持たないことを前提にして、
        // cfir <= (定数) <= csec を検証し、範囲を狭める
        // Ex)
        // 1328 <= (定数) <= 1342
        // -> 1330 <= (定数) <= 1340
        // 1333 <= (定数) <= 1339
        // -> 矛盾しているので、エラーを送出
        // 返り値 : bool
        // true - 異常なし , false - 矛盾が発生
        public bool ConstValidate(ref int cfir, ref int csec)
        {
            // 10単位(本来の0.1単位)に丸める
            if (cfir % 10 != 0) { cfir += 10 - cfir % 10; }
            csec -= csec % 10;

            if (cfir > csec) { return false; }
            return true;
        }

        // [曲ID] の譜面定数が first 以上 second 以下であるとの情報を ConstIneq に追加
        // (ConstValidateを含む)
        // 返り値 : bool
        // true - 異常なし , false - 矛盾が発生
        public bool ConstUpdate(int id, int first, int second)
        {
            int cfir = Math.Max(ConstIneq[id].first, first);
            int csec = Math.Min(ConstIneq[id].second, second);

            if (!ConstValidate(ref cfir, ref csec)) { return false; }

            ConstIneq[id] = (cfir, csec);

            return true;
        }

        // 曲IDがid番の曲について、筐体表示レベルで定数を初期化
        public void AddSongData(int id, SongData inputData)
        {
            ConstIneq[id] = (inputData.fir, inputData.sec);
        }

        private const int BaseElement = 5;
        private static readonly List<int> BaseScore = new List<int> { 1007500, 1000000, 975000, 925000, 900000 };
        private static readonly List<int> BaseOffset = new List<int> { 200, 100, 0, -300, -500 };

        public static int ScoreToOffset(int score)
        {
            if (score >= BaseScore[0]) { return BaseOffset[0]; }
            for (int i = 1; i < BaseElement; i++)
            {
                if (score >= BaseScore[i])
                {
                    // 小数第3位より下は自動切り捨て
                    // 計算順に注意! C++の int(32bit符号付き整数) には収まる
                    return BaseOffset[i] + (BaseOffset[i - 1] - BaseOffset[i]) * (score - BaseScore[i]) / (BaseScore[i - 1] - BaseScore[i]);
                }
            }
            // A未満なので、データ破棄
            return -inf;
        }

        // 追加した情報を処理
        // ここがメインパート! むずかしい!
        // 下のInputSetData内で呼ばれる
        // 返り値 : bool
        // true : 成功 , false : データ破損
        public bool Run(Queue<int> qu)
        {
            while (qu.Any())
            {
                int cid = qu.Dequeue(); // 着目する曲ID
                foreach (var nid in RelateSong[cid])
                { // nid を cid と関連する曲ID全てについて走査
                    bool change = false; // nidに関する制約に変動があったかどうか
                    (int id1, int id2) CNp = (cid, nid);
                    // 最大値規定制約
                    if (ConstIneq[cid].second + ReqMax[CNp] < ConstIneq[nid].second) { change = true; }
                    // 最小値規定制約
                    if (ConstIneq[cid].first + ReqMin[CNp] > ConstIneq[nid].first) { change = true; }

                    // ConstIneq[nid] に変動が生じる場合
                    if (change)
                    {
                        // 新たな制約を追加して壊れたら、破滅
                        if (!ConstUpdate(nid, ConstIneq[cid].first + ReqMin[CNp], ConstIneq[cid].second + ReqMax[CNp]))
                        {
                            return false;
                        }
                        // nid を基準とする処理を処理待ち queue に追加
                        qu.Enqueue(nid);
                    }
                }
            }
            return true;
        }

        // Best枠 (Recent枠) 情報入力
        // 返り値 : bool
        // true : 成功 , false : データ破損
        public bool AddSetData(SetData inputData)
        {
            // i-1個目とi個目のデータについて、データを追加
            for (int i = 1; i < inputData.SetSong; i++)
            {
                int Uid = inputData.Songid[i - 1], Uofs = inputData.Offset[i - 1]; // 順位が高い方
                int Lid = inputData.Songid[i], Lofs = inputData.Offset[i]; // 順位が低い方
                if (Uid == Lid) { continue; } // 同じ曲同士なら、処理を無視
                (int id1, int id2) ULp = (Uid, Lid);
                (int id1, int id2) LUp = (Lid, Uid);

                //はじめての関係なら、その関係の初期化処理を行う
                if (!RelateSong[Uid].Contains(Lid))
                {
                    //関係を追加
                    RelateSong[Uid].Add(Lid);
                    RelateSong[Lid].Add(Uid);
                    //最も甘い条件で初期化
                    ReqMin[ULp] = -inf;
                    ReqMax[ULp] = inf;
                    ReqMin[LUp] = -inf;
                    ReqMax[LUp] = inf;
                }

                // (上の定数) + Uofs >= (下の定数) + Lofs
                // 上を基準に、下の最大値制約が規定、必要があれば更新される
                ReqMax[ULp] = Math.Min(Uofs - Lofs, ReqMax[ULp]);
                // 下を基準に、上の最小値制約が規定、必要があれば更新される
                ReqMin[LUp] = Math.Max(Lofs - Uofs, ReqMin[LUp]);
                // ここで、minとmaxが逆に対応することに注意(これで正しいです)
            }

            var qu = new Queue<int>(); // Runに渡すqueue
            for (int i = 0; i < inputData.SetSong; i++) { qu.Enqueue(inputData.Songid[i]); } // 関係が動きうる全曲を追加
            return Run(qu); // 影響を伝播
        }

        // 単曲制約追加
        // 返り値 : bool
        // true : 成功 , false : データ破損
        public bool AddOneData(OneData inputData)
        {
            if (!ConstUpdate(inputData.id, inputData.first, inputData.second)) { return false; } // 単曲で定数制約更新
            var qu = new Queue<int>();
            qu.Enqueue(inputData.id);
            return Run(qu);
        }
    }
}
