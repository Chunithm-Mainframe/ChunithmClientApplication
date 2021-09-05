using ChunithmClientLibrary.ChunithmMusicDatabase.API.Structs;
using System.Collections.Generic;

namespace ChunithmClientLibrary.ChunithmMusicDatabase
{
    public interface IPlayerRatingTable
    {
        IReadOnlyList<IPlayerRating> Records { get; }
    }
}
