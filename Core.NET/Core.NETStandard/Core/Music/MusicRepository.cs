using ChunithmClientLibrary.ChunithmNet.Data;
using System.Collections.Generic;
using System.Linq;

namespace ChunithmClientLibrary.Core
{
    public interface IMusicRepository
    {
        IReadOnlyList<string> GetMusicGenres();
        IReadOnlyList<IMasterMusic> GetMasterMusics();
        IReadOnlyList<IMusic> GetMusics();

        IMasterMusic GetMasterMusic(int id);
        IMasterMusic GetMasterMusic(string name);

        IMusic GetMusic(int id, Difficulty difficulty);
        IMusic GetMusic(string name, Difficulty difficulty);
    }

    public class MusicRepository : IMusicRepository
    {
        private readonly IReadOnlyList<string> genres;
        private readonly IReadOnlyDictionary<int, IMasterMusic> masterMusicTable;
        private readonly List<Music> musics;

        public IReadOnlyList<string> GetMusicGenres() => genres;

        public IReadOnlyList<IMasterMusic> GetMasterMusics() => masterMusicTable.Values.ToList();

        public IReadOnlyList<IMusic> GetMusics() => musics;

        public IMasterMusic GetMasterMusic(int id) => masterMusicTable.GetValueOrDefault(id);

        public IMasterMusic GetMasterMusic(string name) => masterMusicTable.Values.FirstOrDefault(x => x.Name == name);

        public IMusic GetMusic(int id, Difficulty difficulty) => GetMusic(GetMasterMusic(id), difficulty);

        public IMusic GetMusic(string name, Difficulty difficulty) => GetMusic(GetMasterMusic(name), difficulty);

        private IMusic GetMusic(IMasterMusic masterMusic, Difficulty difficulty)
        {
            if (masterMusic == null)
            {
                return null;
            }

            return musics.FirstOrDefault(x => x.MasterMusic.Id == masterMusic.Id && x.Difficulty == difficulty);
        }

        public MusicRepository(MusicGenre musicGenre, IEnumerable<MusicLevel> musicLevels)
        {
            masterMusicTable = musicGenre.Units.Select(x => new MasterMusic(x)).ToDictionary(x => x.Id, x => x as IMasterMusic);
            genres = CreateGenres(masterMusicTable.Values);
            musics = CreateMusics(masterMusicTable.Values, musicLevels.SelectMany(x => x.Units).Select(x => new MusicRating(x)));
        }

        public MusicRepository(IEnumerable<IMasterMusic> masterMusics, IEnumerable<IMusicRating> musicRatings)
        {
            masterMusicTable = masterMusics.ToDictionary(x => x.Id, x => x);
            genres = CreateGenres(masterMusicTable.Values);
            musics = CreateMusics(masterMusicTable.Values, musicRatings);
        }

        private static IReadOnlyList<string> CreateGenres(IEnumerable<IMasterMusic> masterMusics)
        {
            return masterMusics.Select(x => x.Genre).Distinct().ToList();
        }

        private static List<Music> CreateMusics(IEnumerable<IMasterMusic> masterMusics, IEnumerable<IMusicRating> musicRatings)
        {
            return masterMusics
                .GroupJoin(musicRatings, x => x.Id, x => x.MasterMusicId, (masterMusic, musicRatings) => (masterMusic, musicRatings))
                .SelectMany(x => x.musicRatings.Select(y => new Music(x.masterMusic, y)).OrderBy(x => x.Difficulty))
                .ToList();
        }
    }
}
