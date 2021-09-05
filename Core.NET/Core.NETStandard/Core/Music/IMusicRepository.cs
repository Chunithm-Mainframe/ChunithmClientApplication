using System.Collections.Generic;

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
}
