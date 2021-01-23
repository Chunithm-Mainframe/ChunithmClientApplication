using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;

namespace ChunithmClientLibrary.Core
{
    [DataContract]
    public sealed class MusicDataTable : IMusicDataTable
    {
        public static IMusicDataTable MergeTable(IMusicDataTable oldTable, IMusicDataTable newTable)
        {
            var merged = new MusicDataTable();
            merged.AddRange(oldTable.MusicDatas);
            merged.AddRange(newTable.MusicDatas);
            return merged;
        }

        [DataMember(Name = "music_datas")]
        private readonly List<MusicData> musicDatas = new List<MusicData>();

        public IReadOnlyList<IMusicData> MusicDatas => musicDatas;

        public IReadOnlyDictionary<Difficulty, IMusicData> GetMusicDataGroupedByDifficulty(int id)
            => GetMusicDataGroupedByDifficultyInternal(id) as IReadOnlyDictionary<Difficulty, IMusicData>;

        private MusicData GetMusicDataInternal(int id, Difficulty difficulty)
            => GetMusicDataGroupedByDifficultyInternal(id)?.GetValueOrDefault(difficulty);

        private IReadOnlyDictionary<Difficulty, MusicData> GetMusicDataGroupedByDifficultyInternal(int id)
        {
            return musicDatas.Where(x => x.Id == id).OrderBy(x => x.Difficulty).ToDictionary(x => x.Difficulty);
        }

        public IReadOnlyDictionary<Difficulty, IMusicData> GetMusicDataGroupedByDifficulty(string name)
             => GetMusicDataGroupedByDifficultyInternal(name) as IReadOnlyDictionary<Difficulty, IMusicData>;

        private IReadOnlyDictionary<Difficulty, MusicData> GetMusicDataGroupedByDifficultyInternal(string name)
        {
            return musicDatas.Where(x => x.Name == name).OrderBy(x => x.Difficulty).ToDictionary(x => x.Difficulty);
        }

        public void AddRange(IEnumerable<IMusicData> source)
            => AddRangeInternal(source, true);

        public void AddRange(MusicGenre source)
            => AddRangeInternal(source?.Units?.Select(u => new MusicData(u)), false);

        public void AddRange(MusicLevel source)
            => AddRangeInternal(source?.Units?.Select(u => new MusicData(u)), false);

        private void AddRangeInternal(IEnumerable<IMusicData> source, bool instantiate)
        {
            _ = source ?? throw new ArgumentNullException(nameof(source));

            foreach (var x in source)
            {
                AddInternal(x, instantiate);
            }
        }

        public void Add(IMusicData source)
        {
            AddInternal(source, true);
        }

        private void AddInternal(IMusicData source, bool instantiate)
        {
            var current = GetMusicDataInternal(source.Id, source.Difficulty);
            if (current != null)
            {
                Merge(current, source);
            }
            else
            {
                if (!instantiate && source is MusicData md)
                {
                    musicDatas.Add(md);
                }
                else
                {
                    musicDatas.Add(new MusicData(source));
                }
            }
        }

        private void Merge(MusicData target, IMusicData source)
        {
            if (string.IsNullOrEmpty(target.Genre))
            {
                target.Genre = source.Genre;
            }

            if (!target.Verified && source.BaseRating > 0)
            {
                target.BaseRating = source.BaseRating;
                target.Verified = source.Verified;
            }
        }
    }
}
