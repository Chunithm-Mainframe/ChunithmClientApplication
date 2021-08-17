using ChunithmClientLibrary.ChunithmNet.Data;
using System.Collections.Generic;
using System.Linq;

namespace ChunithmClientLibrary.Core
{
    public interface IReadOnlyMusicRepository
    {
        IReadOnlyList<string> GetMusicGenres();
        IReadOnlyList<IMasterMusic> GetMasterMusics();
        IReadOnlyList<IMusic> GetMusics();

        IMasterMusic GetMasterMusic(int id);
        IMasterMusic GetMasterMusic(string name);

        IMusic GetMusic(int id, Difficulty difficulty);
        IMusic GetMusic(string name, Difficulty difficulty);
    }

    public interface IMusicRepository : IReadOnlyMusicRepository
    {
        void Set(IEnumerable<IMasterMusic> masterMusics, IEnumerable<IMusicRating> musicRatings);
    }

    public class MusicRepository : IMusicRepository
    {
        private readonly List<Music> musics = new List<Music>();

        public IReadOnlyList<string> GetMusicGenres() => musics.Select(x => x.MasterMusic.Genre).Distinct().ToList();

        public IReadOnlyList<IMasterMusic> GetMasterMusics() => GetMusics().GroupBy(x => x.MasterMusic.Id).Select(x => x.First().MasterMusic).ToList();

        public IReadOnlyList<IMusic> GetMusics() => musics;

        public IMasterMusic GetMasterMusic(int id) => musics.FirstOrDefault(x => x.MasterMusic.Id == id)?.MasterMusic;

        public IMasterMusic GetMasterMusic(string name) => musics.FirstOrDefault(x => x.MasterMusic.Name == name)?.MasterMusic;

        public IMusic GetMusic(int id, Difficulty difficulty)
            => GetMusic(musics.FirstOrDefault(x => x.MasterMusic.Id == id)?.MasterMusic, difficulty);

        public IMusic GetMusic(string name, Difficulty difficulty)
            => GetMusic(musics.FirstOrDefault(x => x.MasterMusic.Name == name)?.MasterMusic, difficulty);

        private IMusic GetMusic(IMasterMusic masterMusic, Difficulty difficulty)
        {
            if (masterMusic == null)
            {
                return null;
            }

            return musics.FirstOrDefault(x => x.MasterMusic.Id == masterMusic.Id && x.Difficulty == difficulty);
        }

        public void Set(MusicGenre musicGenre, IEnumerable<MusicLevel> musicLevels)
        {
            var masterMusics = musicGenre.Units.Select(x => new MasterMusic
            {
                Id = x.Id,
                Name = x.Name,
                Genre = x.Genre,
            });

            var musicRatings = musicLevels
                .SelectMany(x => x.Units)
                .Select(x => new MusicRating
                {
                    MasterMusicId = x.Id,
                    Difficulty = x.Difficulty,
                    BaseRating = x.Level,
                    Verified = false,
                });

            Set(masterMusics, musicRatings);
        }

        public void Set(IEnumerable<IMasterMusic> masterMusics, IEnumerable<IMusicRating> musicRatings)
        {
            var masterMusicMap = masterMusics.ToDictionary(x => x.Id, x => x);
            var musics = musicRatings.Where(x => masterMusicMap.ContainsKey(x.MasterMusicId))
                .Select(x => new Music(masterMusicMap[x.MasterMusicId], x));

            this.musics.AddRange(musics);
        }
    }
}
