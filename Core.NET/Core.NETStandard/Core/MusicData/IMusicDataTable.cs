using System.Collections.Generic;

namespace ChunithmClientLibrary.Core
{
    public interface IMusicDataTable
    {
        IReadOnlyList<IMusicData> MusicDatas { get; }
        IMusicData GetMusicData(int id, Difficulty difficulty) => GetMusicDataGroupedByDifficulty(id)?.GetValueOrDefault(difficulty);
        IMusicData GetMusicData(string name, Difficulty difficulty) => GetMusicDataGroupedByDifficulty(name)?.GetValueOrDefault(difficulty);
        IReadOnlyDictionary<Difficulty, IMusicData> GetMusicDataGroupedByDifficulty(int id);
        IReadOnlyDictionary<Difficulty, IMusicData> GetMusicDataGroupedByDifficulty(string name);
    }
}
