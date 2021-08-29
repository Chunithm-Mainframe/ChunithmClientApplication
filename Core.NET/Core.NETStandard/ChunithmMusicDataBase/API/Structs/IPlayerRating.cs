using System.Collections.Generic;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.API.Structs
{
    public interface IPlayerRating
    {
        int Id { get; }
        IReadOnlyList<IPlayRecord> BestRatings { get; }
        IReadOnlyList<IPlayRecord> OutsideBestRatings { get; }
        IReadOnlyList<IPlayRecord> RecentRatings { get; }
    }
}
