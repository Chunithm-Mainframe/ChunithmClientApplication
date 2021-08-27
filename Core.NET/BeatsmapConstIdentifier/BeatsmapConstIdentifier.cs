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
        public IReadOnlyList<Song> Songs => songs.Values.ToList();

        // ConstIneq
        private readonly Dictionary<int, Song> songs = new Dictionary<int, Song>();

        // RelateSong[ i ] の要素 = (曲ID i)と何らかの関係式が存在する曲IDの集合
        private readonly Dictionary<int, HashSet<int>> relateSongsMap = new Dictionary<int, HashSet<int>>();

        private HashSet<int> GetRelateSongs(int id)
        {
            if (!relateSongsMap.ContainsKey(id))
            {
                relateSongsMap[id] = new HashSet<int>();
            }
            return relateSongsMap[id];
        }

        // ReqMin[ (曲ID : s , 曲ID : t) ] = {数値v}
        // 「 (tの譜面定数) >= (sの譜面定数) + v 」(vが負になる可能性もある)
        // 最も緩い制約は、v=-inf
        private readonly Dictionary<(int id1, int id2), int> requiredMin = new Dictionary<(int id1, int id2), int>();

        // ReqMax[ (曲ID : s , 曲ID : t) ] = {数値v}
        // 「 (tの譜面定数) <= (sの譜面定数) + v 」(vが負になる可能性もある)
        // 最も緩い制約は、v=inf
        private readonly Dictionary<(int id1, int id2), int> requiredMax = new Dictionary<(int id1, int id2), int>();

        public static int CeilingLowerLimit(int lowerLimit)
        {
            return (lowerLimit % 10 != 0) ? lowerLimit + (10 - lowerLimit % 10) : lowerLimit;
        }

        public static int FloorUpperLimit(int upperLimit)
        {
            return upperLimit - upperLimit % 10;
        }

        public void AddSong(Song song)
        {
            if (song.IsValid())
            {
                songs.Add(song.Id, song);
            }
        }

        public void AddSongs(IEnumerable<Song> songs)
        {
            foreach (var song in songs)
            {
                AddSong(song);
            }
        }

        // 単曲制約追加
        // true : 成功 , false : データ破損
        public bool UpdateSong(Song song)
        {
            if (!ConstUpdate(song.Id, song.LowerLimit, song.UpperLimit))
            {
                return false;
            }
            return Run(song.Id);
        }

        // Best枠 (Recent枠) 情報入力
        // true : 成功 , false : データ破損
        public bool AddSetData(SetData setData)
        {
            var units = setData.Units.Where(x => x.Offset >= 0).ToArray();

            // i-1個目とi個目のデータについて、データを追加
            for (int i = 1; i < units.Length; i++)
            {
                // 順位が高い方
                var upperId = units[i - 1].SongId;
                var upperOffset = units[i - 1].Offset;

                // 順位が低い方
                var lowerId = units[i].SongId;
                var lowerOffset = units[i].Offset;

                if (upperId == lowerId) { continue; } // 同じ曲同士なら、処理を無視

                //はじめての関係なら、その関係の初期化処理を行う
                if (!GetRelateSongs(upperId).Contains(lowerId))
                {
                    //関係を追加
                    GetRelateSongs(upperId).Add(lowerId);
                    GetRelateSongs(lowerId).Add(upperId);

                    //最も甘い条件で初期化
                    requiredMin[(upperId, lowerId)] = -Utility.Infinity;
                    requiredMax[(upperId, lowerId)] = Utility.Infinity;
                    requiredMin[(lowerId, upperId)] = -Utility.Infinity;
                    requiredMax[(lowerId, upperId)] = Utility.Infinity;
                }

                // (上の定数) + upperOffset >= (下の定数) + lowerOffset ... (1)

                // (1) => (下の定数) <= (上の定数) + (upperOffset - lowerOffset)
                // 上を基準に、下の最大値制約が規定、必要があれば更新される
                requiredMax[(upperId, lowerId)] = Math.Min(upperOffset - lowerOffset, requiredMax[(upperId, lowerId)]);

                // (1) => (上の定数) >= (下の定数) + lowerOffset - upperOffset
                // 下を基準に、上の最小値制約が規定、必要があれば更新される
                requiredMin[(lowerId, upperId)] = Math.Max(lowerOffset - upperOffset, requiredMin[(lowerId, upperId)]);

                // ここで、minとmaxが逆に対応することに注意(これで正しいです)
            }

            return Run(new Queue<int>(units.Select(x => x.SongId))); // 影響を伝播
        }

        private bool Run(int requestSongId)
        {
            return Run(new Queue<int>(new[] { requestSongId }));
        }

        // 追加した情報を処理
        // ここがメインパート! むずかしい!
        // 下のInputSetData内で呼ばれる
        // true : 成功 , false : データ破損
        private bool Run(Queue<int> requestSongIds)
        {
            while (requestSongIds.Any())
            {
                int currentId = requestSongIds.Dequeue();
                foreach (var targetId in GetRelateSongs(currentId))
                {
                    var reqKey = (currentId, targetId);
                    var nextUpperLimit = songs[currentId].UpperLimit + requiredMax[reqKey];
                    var nextLowerLimit = songs[currentId].LowerLimit + requiredMin[reqKey];

                    // Songs[targetId] に変動が生じる場合
                    if (nextUpperLimit < songs[targetId].UpperLimit || nextLowerLimit > songs[targetId].LowerLimit)
                    {
                        // 新たな制約を追加して壊れたら、破滅
                        if (!ConstUpdate(targetId, nextLowerLimit, nextUpperLimit))
                        {
                            return false;
                        }

                        // targetId を基準とする処理を処理待ち queue に追加
                        requestSongIds.Enqueue(targetId);
                    }
                }
            }
            return true;
        }

        // [曲ID] の譜面定数が lowerLimit 以上 upperLimit 以下であるとの情報を Songs に追加
        // (ConstValidateを含む)
        // true - 異常なし , false - 矛盾が発生
        private bool ConstUpdate(int id, int lowerLimit, int upperLimit)
        {
            var nextSong = new Song(
                id,
                lowerLimit: CeilingLowerLimit(Math.Max(songs[id].LowerLimit, lowerLimit)),
                upperLimit: FloorUpperLimit(Math.Min(songs[id].UpperLimit, upperLimit)));

            if (!nextSong.IsValid())
            {
                return false;
            }

            songs[id] = nextSong;

            return true;
        }
    }
}
