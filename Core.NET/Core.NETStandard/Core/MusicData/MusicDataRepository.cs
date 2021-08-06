using ChunithmClientLibrary.ChunithmNet.Data;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ChunithmClientLibrary.Core
{
    public interface IMasterMusic
    {
        int Id { get; }
        string Name { get; }
        string Genre { get; }
    }

    public class MasterMusic : IMasterMusic
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Genre { get; set; }
    }

    public interface IMusicRating
    {
        int Id { get; }
        Difficulty Difficulty { get; }
        double BaseRating { get; }
        bool Verified { get; }
    }

    public class MusicRating : IMusicRating
    {
        public int Id { get; set; }
        public Difficulty Difficulty { get; set; }
        public double BaseRating { get; set; }
        public bool Verified { get; set; }
    }

    public interface IMusic : IMasterMusic, IMusicRating
    {
    }

    public class Music : IMusic
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Genre { get; set; }
        public Difficulty Difficulty { get; set; }
        public double BaseRating { get; set; }
        public bool Verified { get; set; }

        public Music()
        {
        }

        public Music(IMasterMusic masterMusic, IMusicRating musicRating)
        {
            Set(masterMusic, musicRating);
        }

        public void Set(IMasterMusic masterMusic, IMusicRating musicRating)
        {
            _ = masterMusic ?? throw new ArgumentNullException(nameof(masterMusic));
            _ = musicRating ?? throw new ArgumentNullException(nameof(musicRating));

            if (masterMusic.Id != musicRating.Id)
            {
                throw new ArgumentException($"IDs do not match. IMasterMusic.Id={masterMusic.Id}, IMusicRating.Id={musicRating.Id}");
            }

            Set(masterMusic.Id,
                masterMusic.Name,
                masterMusic.Genre,
                musicRating.Difficulty,
                musicRating.BaseRating,
                musicRating.Verified);
        }

        public void Set(int id, string name, string genre, Difficulty difficulty, double baseRating, bool verified)
        {
            Id = id;
            Name = name;
            Genre = genre;
            Difficulty = difficulty;
            BaseRating = baseRating;
            Verified = verified;
        }
    }

    public class MusicDataRepository
    {
        private readonly Dictionary<int, MasterMusic> masterMusicMap = new Dictionary<int, MasterMusic>();
        private readonly Dictionary<int, Dictionary<Difficulty, MusicRating>> musicRatingGroupMap = new Dictionary<int, Dictionary<Difficulty, MusicRating>>();

        public IReadOnlyDictionary<int, IMasterMusic> GetMasterMusicMap()
            => new Dictionary<int, MasterMusic>(masterMusicMap) as IReadOnlyDictionary<int, IMasterMusic>;

        public IReadOnlyList<IMasterMusic> GetMasterMusics() => new List<IMasterMusic>(masterMusicMap.Values);

        public IReadOnlyDictionary<int, IReadOnlyDictionary<Difficulty, IMusicRating>> GetMusicRatingGroupMap()
            => new Dictionary<int, Dictionary<Difficulty, MusicRating>>(musicRatingGroupMap) as IReadOnlyDictionary<int, IReadOnlyDictionary<Difficulty, IMusicRating>>;

        public IReadOnlyList<IMusicRating> GetMusicRatings()
            => musicRatingGroupMap.Values.SelectMany(x => x.Values).ToList();

        public IReadOnlyList<IMusic> GetMusics()
        {
            return masterMusicMap.Values.Where(x => musicRatingGroupMap.ContainsKey(x.Id))
                .SelectMany(x => musicRatingGroupMap[x.Id].Values.Select(y => new Music(x, y)))
                .ToList();
        }

        public IMasterMusic GetMasterMusic(int id)
        {
            return masterMusicMap.GetValueOrDefault(id);
        }

        public IMasterMusic GetMasterMusic(string name)
        {
            return masterMusicMap.Values.FirstOrDefault(x => x.Name == name);
        }

        public IReadOnlyDictionary<Difficulty, IMusicRating> GetMusicRatingGroup(int id)
        {
            return GetMusicRatingGroup(GetMasterMusic(id)) as IReadOnlyDictionary<Difficulty, IMusicRating>;
        }

        public IReadOnlyDictionary<Difficulty, IMusicRating> GetMusicRatingGroup(string name)
        {
            return GetMusicRatingGroup(GetMasterMusic(name)) as IReadOnlyDictionary<Difficulty, IMusicRating>;
        }

        private Dictionary<Difficulty, MusicRating> GetMusicRatingGroup(IMasterMusic masterMusic)
        {
            return masterMusic != null ? musicRatingGroupMap.GetValueOrDefault(masterMusic.Id) : null;
        }

        public IMusicRating GetMusicRating(int id, Difficulty difficulty)
        {
            return GetMusicRatingGroup(id)?.GetValueOrDefault(difficulty);
        }

        public IMusicRating GetMusicRating(string name, Difficulty difficulty)
        {
            return GetMusicRatingGroup(name)?.GetValueOrDefault(difficulty);
        }

        public IMusic GetMusic(int id, Difficulty difficulty)
        {
            if (!masterMusicMap.TryGetValue(id, out var masterMusic))
            {
                return null;
            }

            if (!musicRatingGroupMap.TryGetValue(id, out var group) || !group.TryGetValue(difficulty, out var musicRating))
            {
                return null;
            }

            return new Music(masterMusic, musicRating);
        }

        public IMusic GetMusic(string name, Difficulty difficulty)
        {
            var masterMusic = masterMusicMap.Values.FirstOrDefault(x => x.Name == name);
            if (masterMusic == null)
            {
                return null;
            }

            var id = masterMusic.Id;
            if (!musicRatingGroupMap.TryGetValue(id, out var group) || !group.TryGetValue(difficulty, out var musicRating))
            {
                return null;
            }

            return new Music(masterMusic, musicRating);
        }

        public void BuildMusics(MusicGenre musicGenre)
        {
            masterMusicMap.Clear();

            foreach (var m in musicGenre.Units)
            {
                var masterMusic = new MasterMusic
                {
                    Id = m.Id,
                    Name = m.Name,
                    Genre = m.Genre,
                };

                masterMusicMap.Add(masterMusic.Id, masterMusic);
            }
        }

        public void UpdateMusicRatings(MusicLevel musicLevel)
        {
            foreach (var unit in musicLevel.Units)
            {
                if (!musicRatingGroupMap.TryGetValue(unit.Id, out var group))
                {
                    group = new Dictionary<Difficulty, MusicRating>();
                    musicRatingGroupMap.Add(unit.Id, group);
                }

                var source = new MusicRating
                {
                    Id = unit.Id,
                    Difficulty = unit.Difficulty,
                    BaseRating = unit.Level,
                    Verified = false,
                };

                if (!group.TryGetValue(source.Difficulty, out var target))
                {
                    if (!target.Verified && source.BaseRating > 0)
                    {
                        target.BaseRating = source.BaseRating;
                        target.Verified = source.Verified;
                    }
                }
                else
                {
                    group.Add(source.Difficulty, source);
                }
            }
        }
    }
}
