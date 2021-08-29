using System.Collections.Generic;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.API.Structs
{
    public class PlayerRating : IPlayerRating
    {
        public int Id { get; set; }
        public IReadOnlyList<IPlayRecord> BestRatings { get; set; }
        public IReadOnlyList<IPlayRecord> OutsideBestRatings { get; set; }
        public IReadOnlyList<IPlayRecord> RecentRatings { get; set; }
    }
}
