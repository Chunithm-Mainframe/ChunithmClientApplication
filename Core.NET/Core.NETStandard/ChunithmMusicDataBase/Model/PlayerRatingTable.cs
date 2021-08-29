using ChunithmClientLibrary.ChunithmMusicDatabase.API.Structs;
using System.Collections.Generic;

namespace ChunithmClientLibrary.ChunithmMusicDatabase
{
    public class PlayerRatingTable : IPlayerRatingTable
    {
        public IReadOnlyList<IPlayerRating> Records { get; set; }
    }
}
