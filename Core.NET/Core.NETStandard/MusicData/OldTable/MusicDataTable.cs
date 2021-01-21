using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.Table;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;

namespace ChunithmClientLibrary.MusicData
{
    [DataContract]
    public abstract class MusicDataTable<TMusicDataTableUnit> : SerializableTable<TMusicDataTableUnit>, IMusicDataTable<TMusicDataTableUnit>
        where TMusicDataTableUnit : IMusicDataTableUnit
    {
        public virtual TMusicDataTableUnit GetTableUnit(int id)
        {
            var tableUnits = GetTableUnits();
            if (tableUnits == null)
            {
                return default(TMusicDataTableUnit);
            }

            return tableUnits.FirstOrDefault(tableUnit => tableUnit.Id == id);
        }

        public virtual TMusicDataTableUnit GetTableUnit(string name)
        {
            var tableUnits = GetTableUnits();
            if (tableUnits == null)
            {
                return default(TMusicDataTableUnit);
            }

            return tableUnits.FirstOrDefault(tableUnit => tableUnit.Name == name);
        }
    }

    [DataContract]
    public sealed class MusicDataTable : MusicDataTable<IMusicDataTableUnit>
    {
        public static MusicDataTable MergeTable(IMusicDataTable<IMusicDataTableUnit> oldTable, IMusicDataTable<IMusicDataTableUnit> newTable)
        {
            var merged = new MusicDataTable();
            merged.Add<IMusicDataTableUnit>(newTable);
            merged.Add<IMusicDataTableUnit>(oldTable);
            return merged;
        }

        [DataMember]
        public List<MusicDataTableUnit> MusicDatas { get; private set; } = new List<MusicDataTableUnit>();

        public override IEnumerable<IMusicDataTableUnit> GetTableUnits()
        {
            return MusicDatas.AsEnumerable<IMusicDataTableUnit>();
        }

        public void Sort(IComparer<IMusicDataTableUnit> comparer)
        {
            MusicDatas.Sort(comparer);
        }

        public override void Add<TTableUnit>(TTableUnit tableUnit)
        {
            var cachedMusicData = MusicDatas.FirstOrDefault(data => data.Id == tableUnit.Id);
            if (cachedMusicData != null)
            {
                Merge(cachedMusicData, tableUnit);
            }
            else
            {
                MusicDatas.Add(new MusicDataTableUnit(tableUnit));
            }
        }

        public void Add(MusicGenre musicGenre)
        {
            if (musicGenre == null)
            {
                throw new System.ArgumentNullException(nameof(musicGenre));
            }

            foreach (var unit in musicGenre.Units.Select(u => new MusicDataTableUnit(u)))
            {
                Add(unit);
            }
        }

        public void Add(MusicLevel musicLevel)
        {
            if (musicLevel == null)
            {
                throw new System.ArgumentNullException(nameof(musicLevel));
            }

            foreach (var unit in musicLevel.Units.Select(u => new MusicDataTableUnit(u)))
            {
                Add(unit);
            }
        }

        public override void Clear()
        {
            MusicDatas.Clear();
        }

        private void Merge(MusicDataTableUnit target, IMusicDataTableUnit source)
        {
            if (string.IsNullOrEmpty(target.Genre))
            {
                target.Genre = source.Genre;
            }

            var difficulties = new[]
            {
                Difficulty.Basic,
                Difficulty.Advanced,
                Difficulty.Expert,
                Difficulty.Master
            };

            for (var i = 0; i < difficulties.Length; i++)
            {
                if (!target.VerifiedBaseRating(difficulties[i]) && source.GetBaseRating(difficulties[i]) > 0)
                {
                    target.SetBaseRating(difficulties[i], source.GetBaseRating(difficulties[i]));
                    target.SetVerifiedBaseRating(difficulties[i], source.VerifiedBaseRating(difficulties[i]));
                }
            }
        }
    }
}
