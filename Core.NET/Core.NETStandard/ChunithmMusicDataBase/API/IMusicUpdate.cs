using ChunithmClientLibrary.Core;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.API
{
    public partial interface IChunithmMusicDatabaseConnector : IMusicUpdate
    {
    }

    public interface IMusicUpdate
    {
        Task<IMusicUpdateResponse> UpdateMusicAsync(IMusicUpdateRequest request);
        Task<IMusicUpdateResponse> UpdateMusicAsync(IEnumerable<IMusic> musics);
        Task<IMusicUpdateResponse> UpdateMusicAsync(IEnumerable<(int id, Difficulty difficulty, double baseRating)> musics);
    }

    public interface IMusicUpdateRequest : IChunithmMusicDatabaseApiRequest
    {
        IReadOnlyList<(int id, Difficulty difficulty, double baseRating)> Musics { get; }
    }

    public interface IMusicUpdateResponse : IChunithmMusicDatabaseApiResponse
    {
        IReadOnlyList<(int id, Difficulty difficulty, double baseRating)> UpdatedMusics { get; }
    }
}
