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
        public class Song
        {
            public int LowerLimit { get; set; }
            public int UpperLimit { get; set; }

            public Song() { }

            public Song(int lowerLimit, int upperLimit)
            {
                LowerLimit = lowerLimit;
                UpperLimit = upperLimit;
            }
        }

        public class SetData
        {
            public List<int> SongIds = new List<int>();
            public List<int> Offsets = new List<int>();
        }

        public class OneData
        {
            public int Id;
            public int LowerLimit;
            public int UpperLimit;
        }

        // 十分大きな値として inf を定義
        public const int inf = 1000000007;

        public IReadOnlyList<Song> Songs => songs;

        // ConstIneq
        private readonly List<Song> songs;

        // RelateSong[ i ] の要素 = (曲ID i)と何らかの関係式が存在する曲IDの集合
        private readonly List<HashSet<int>> relateSong;

        // ReqMin[ (曲ID : s , 曲ID : t) ] = {数値v}
        // 「 (tの譜面定数) >= (sの譜面定数) + v 」(vが負になる可能性もある)
        // 最も緩い制約は、v=-inf
        private readonly Dictionary<(int id1, int id2), int> requiredMin = new Dictionary<(int id1, int id2), int>();

        // ReqMax[ (曲ID : s , 曲ID : t) ] = {数値v}
        // 「 (tの譜面定数) <= (sの譜面定数) + v 」(vが負になる可能性もある)
        // 最も緩い制約は、v=inf
        private readonly Dictionary<(int id1, int id2), int> requireMax = new Dictionary<(int id1, int id2), int>();

        public _BeatsmapConstIdentifier(int songNum)
        {
            songs = new List<Song>(songNum + 1);
            relateSong = Enumerable.Range(0, songNum + 1).Select(_ => new HashSet<int>()).ToList();
        }

        // 譜面定数が小数第1位までしか持たないことを前提にして、
        // lowerLimit <= (定数) <= upperLimit を検証し、範囲を狭める
        // Ex)
        // 1328 <= (定数) <= 1342
        // -> 1330 <= (定数) <= 1340
        // 1333 <= (定数) <= 1339
        // -> 矛盾しているので、エラーを送出
        // true - 異常なし , false - 矛盾が発生
        public bool ConstValidate(ref int lowerLimit, ref int upperLimit)
        {
            // 10単位(本来の0.1単位)に丸める
            if (lowerLimit % 10 != 0) { lowerLimit += 10 - lowerLimit % 10; }
            upperLimit -= upperLimit % 10;

            if (lowerLimit > upperLimit)
            {
                return false;
            }
            return true;
        }

        // [曲ID] の譜面定数が currentLowerLimit 以上 currentUpperLimit 以下であるとの情報を Songs に追加
        // (ConstValidateを含む)
        // true - 異常なし , false - 矛盾が発生
        public bool ConstUpdate(int id, int currentLowerLimit, int currentUpperLimit)
        {
            int nextLowerLimit = Math.Max(songs[id].LowerLimit, currentLowerLimit);
            int nextUpperLimit = Math.Min(songs[id].UpperLimit, currentUpperLimit);

            if (!ConstValidate(ref nextLowerLimit, ref nextUpperLimit))
            {
                return false;
            }

            songs[id] = new Song(nextLowerLimit, nextUpperLimit);

            return true;
        }

        public void AddSong(Song song)
        {
            songs.Add(song);
        }

        public void AddSongs(IEnumerable<Song> songs)
        {
            this.songs.AddRange(songs);
        }

        // スコアを (定数) + x という形に変換、xを返す
        // 例 :
        // 1007500 : 返答は 200 (+2.00なので)
        // 990000 : 返答は 60 (+0.60なので)
        // 一応、この関数はAまでの定数に対応しておく
        // それ未満は、-infを返答とする

        // 定数用基準スコア
        // BaseScore[i]であれば丁度BaseOffset[i] 加点される
        // 間は線形補間

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
        // true : 成功 , false : データ破損
        public bool Run(Queue<int> requests)
        {
            while (requests.Any())
            {
                int currentId = requests.Dequeue();
                foreach (var targetId in relateSong[currentId])
                {
                    var reqKey = (currentId, targetId);
                    var nextUpperLimit = songs[currentId].UpperLimit + requireMax.GetValueOrDefault(reqKey);
                    var nextLowerLimit = songs[currentId].LowerLimit + requiredMin.GetValueOrDefault(reqKey);

                    // Songs[targetId] に変動が生じる場合
                    if (nextUpperLimit < songs[targetId].UpperLimit || nextLowerLimit > songs[targetId].LowerLimit)
                    {
                        // 新たな制約を追加して壊れたら、破滅
                        if (!ConstUpdate(targetId, nextLowerLimit, nextUpperLimit))
                        {
                            return false;
                        }

                        // targetId を基準とする処理を処理待ち queue に追加
                        requests.Enqueue(targetId);
                    }
                }
            }
            return true;
        }

        // Best枠 (Recent枠) 情報入力
        // true : 成功 , false : データ破損
        public bool AddSetData(SetData setData)
        {
            // i-1個目とi個目のデータについて、データを追加
            for (int i = 1; i < setData.SongIds.Count; i++)
            {
                // 順位が高い方
                var upperId = setData.SongIds[i - 1];
                var upperOffset = setData.Offsets[i - 1];

                // 順位が低い方
                var lowerId = setData.SongIds[i];
                var lowerOffset = setData.Offsets[i];

                if (upperId == lowerId) { continue; } // 同じ曲同士なら、処理を無視

                //はじめての関係なら、その関係の初期化処理を行う
                if (!relateSong[upperId].Contains(lowerId))
                {
                    //関係を追加
                    relateSong[upperId].Add(lowerId);
                    relateSong[lowerId].Add(upperId);

                    //最も甘い条件で初期化
                    requiredMin[(upperId, lowerId)] = -inf;
                    requireMax[(upperId, lowerId)] = inf;
                    requiredMin[(lowerId, upperId)] = -inf;
                    requireMax[(lowerId, upperId)] = inf;
                }

                // (上の定数) + upperOffset >= (下の定数) + lowerOffset
                // 上を基準に、下の最大値制約が規定、必要があれば更新される
                requireMax[(upperId, lowerId)] = Math.Min(upperOffset - lowerOffset, requireMax[(upperId, lowerId)]);
                // 下を基準に、上の最小値制約が規定、必要があれば更新される
                requiredMin[(lowerId, upperId)] = Math.Max(lowerOffset - upperOffset, requiredMin[(lowerId, upperId)]);
                // ここで、minとmaxが逆に対応することに注意(これで正しいです)
            }

            return Run(new Queue<int>(setData.SongIds)); // 影響を伝播
        }

        // 単曲制約追加
        // true : 成功 , false : データ破損
        public bool AddOneData(OneData oneData)
        {
            if (!ConstUpdate(oneData.Id, oneData.LowerLimit, oneData.UpperLimit)) { return false; } // 単曲で定数制約更新
            var requests = new Queue<int>();
            requests.Enqueue(oneData.Id);
            return Run(requests);
        }
    }
}
