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

    public class BeatsmapConstIdentifier
    {
        public IReadOnlyList<MusicRating> Musics => rangeMap
            .Select(x => new MusicRating(MusicIdentifier.CreateByUniqueKey(x.Key), x.Value))
            .ToList();

        // ConstIneq
        private readonly Dictionary<int, BaseRatingRange> rangeMap = new();

        // RelateSong[ i ] の要素 = (曲ID i)と何らかの関係式が存在する曲IDの集合
        private readonly Dictionary<int, HashSet<int>> relateMusicsMap = new();

        private HashSet<int> GetRelateMusics(int key)
        {
            if (!relateMusicsMap.ContainsKey(key))
            {
                relateMusicsMap[key] = new HashSet<int>();
            }
            return relateMusicsMap[key];
        }

        // ReqMin[ (曲ID : s , 曲ID : t) ] = {数値v}
        // 「 (tの譜面定数) >= (sの譜面定数) + v 」(vが負になる可能性もある)
        // 最も緩い制約は、v=-inf
        private readonly Dictionary<(int, int), int> requiredMin = new();

        // ReqMax[ (曲ID : s , 曲ID : t) ] = {数値v}
        // 「 (tの譜面定数) <= (sの譜面定数) + v 」(vが負になる可能性もある)
        // 最も緩い制約は、v=inf
        private readonly Dictionary<(int, int), int> requiredMax = new();

        public static int CeilingLowerLimit(int lowerLimit)
        {
            return (lowerLimit % 10 != 0) ? lowerLimit + (10 - lowerLimit % 10) : lowerLimit;
        }

        public static int FloorUpperLimit(int upperLimit)
        {
            return upperLimit - upperLimit % 10;
        }

        public void AddMusic(MusicIdentifier identifier, BaseRatingRange range)
        {
            if (range.IsValid())
            {
                rangeMap.Add(identifier.ToUniqueKey(), range);
            }
        }

        public void AddMusics(IEnumerable<(MusicIdentifier, BaseRatingRange)> musics)
        {
            foreach (var (key, range) in musics)
            {
                AddMusic(key, range);
            }
        }

        // 単曲制約追加
        // true : 成功 , false : データ破損
        public bool UpdateMusics(MusicIdentifier identifier, BaseRatingRange range)
        {
            if (!ConstUpdate(identifier, range.LowerLimit, range.UpperLimit))
            {
                return false;
            }
            return Run(identifier);
        }

        public bool UpdateMusics(IEnumerable<(MusicIdentifier identifier, BaseRatingRange range)> musics)
        {
            foreach (var (key, range) in musics)
            {
                if (!ConstUpdate(key, range.LowerLimit, range.UpperLimit))
                {
                    return false;
                }
            }
            return Run(musics.Select(x => x.identifier));
        }

        // Best枠 (Recent枠) 情報入力
        // true : 成功 , false : データ破損
        public bool AddRatingRecordContainer(RatingRecordContainer container)
        {
            var records = container.Records;

            // i-1個目とi個目のデータについて、データを追加
            for (int i = 1; i < records.Count; i++)
            {
                // 順位が高い
                var upperKey = records[i - 1].ToMusicIdentifier().ToUniqueKey();
                var upperOffset = records[i - 1].Offset;

                // 順位が低い方
                var lowerKey = records[i].ToMusicIdentifier().ToUniqueKey();
                var lowerOffset = records[i].Offset;

                if (upperKey == lowerKey) { continue; } // 同じ曲同士なら、処理を無視

                var upperKey_lowerKey = (upperKey, lowerKey);
                var lowerKey_upperKey = (lowerKey, upperKey);

                //はじめての関係なら、その関係の初期化処理を行う
                if (!GetRelateMusics(upperKey).Contains(lowerKey))
                {
                    //関係を追加
                    GetRelateMusics(upperKey).Add(lowerKey);
                    GetRelateMusics(lowerKey).Add(upperKey);

                    //最も甘い条件で初期化
                    requiredMin[upperKey_lowerKey] = -Utility.Infinity;
                    requiredMax[upperKey_lowerKey] = Utility.Infinity;
                    requiredMin[lowerKey_upperKey] = -Utility.Infinity;
                    requiredMax[lowerKey_upperKey] = Utility.Infinity;
                }

                // (上の定数) + upperOffset >= (下の定数) + lowerOffset ... (1)

                // (1) => (下の定数) <= (上の定数) + (upperOffset - lowerOffset)
                // 上を基準に、下の最大値制約が規定、必要があれば更新される
                requiredMax[upperKey_lowerKey] = Math.Min(upperOffset - lowerOffset, requiredMax[upperKey_lowerKey]);

                // (1) => (上の定数) >= (下の定数) + lowerOffset - upperOffset
                // 下を基準に、上の最小値制約が規定、必要があれば更新される
                requiredMin[lowerKey_upperKey] = Math.Max(lowerOffset - upperOffset, requiredMin[lowerKey_upperKey]);

                // ここで、minとmaxが逆に対応することに注意(これで正しいです)
            }

            return Run(records.Select(x => x.ToMusicIdentifier())); // 影響を伝播
        }

        private bool Run(MusicIdentifier updateRequest)
        {
            return Run(updateRequest.ToUniqueKey());
        }

        private bool Run(int updateRequest)
        {
            return Run(new Queue<int>(new[] { updateRequest }));
        }

        private bool Run(IEnumerable<MusicIdentifier> updateRequests)
        {
            return Run(updateRequests.Select(x => x.ToUniqueKey()));
        }

        private bool Run(IEnumerable<int> updateRequests)
        {
            return Run(new Queue<int>(updateRequests));
        }

        // 追加した情報を処理
        // ここがメインパート! むずかしい!
        // 下のInputSetData内で呼ばれる
        // true : 成功 , false : データ破損
        private bool Run(Queue<int> updateRequests)
        {
            while (updateRequests.Any())
            {
                var currentKey = updateRequests.Dequeue();
                foreach (var targetKey in GetRelateMusics(currentKey))
                {
                    var reqKey = (currentKey, targetKey);
                    var nextUpperLimit = rangeMap[currentKey].UpperLimit + requiredMax[reqKey];
                    var nextLowerLimit = rangeMap[currentKey].LowerLimit + requiredMin[reqKey];

                    if (nextUpperLimit < rangeMap[targetKey].UpperLimit || nextLowerLimit > rangeMap[targetKey].LowerLimit)
                    {
                        // 新たな制約を追加して壊れたら、破滅
                        if (!ConstUpdate(targetKey, nextLowerLimit, nextUpperLimit))
                        {
                            return false;
                        }

                        // targetId を基準とする処理を処理待ち queue に追加
                        updateRequests.Enqueue(targetKey);
                    }
                }
            }
            return true;
        }

        private bool ConstUpdate(MusicIdentifier identifier, int lowerLimit, int upperLimit)
        {
            return ConstUpdate(identifier.ToUniqueKey(), lowerLimit, upperLimit);
        }

        private bool ConstUpdate(int key, int lowerLimit, int upperLimit)
        {
            var nextBaseRatingRange = new BaseRatingRange(
                lowerLimit: CeilingLowerLimit(Math.Max(rangeMap[key].LowerLimit, lowerLimit)),
                upperLimit: FloorUpperLimit(Math.Min(rangeMap[key].UpperLimit, upperLimit)));

            if (!nextBaseRatingRange.IsValid())
            {
                return false;
            }

            rangeMap[key] = nextBaseRatingRange;

            return true;
        }
    }
}
