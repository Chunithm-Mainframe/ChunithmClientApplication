using ChunithmClientLibrary.Core;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.API
{
    public partial interface IChunithmMusicDatabaseConnector : IMusicTableUpdate
    {
    }

    public interface IMusicTableUpdate
    {
        Task<IMusicTableUpdateResponse> UpdateMusicTableAsync(IEnumerable<IMusic> musics);
        Task<IMusicTableUpdateResponse> UpdateMusicTableAsync(IMusicTableUpdateRequest request);
    }

    public interface IMusicTableUpdateRequest : IChunithmMusicDatabaseApiRequest
    {
        IReadOnlyList<IMusic> Musics { get; }
    }

    public interface IMusicTableUpdateResponse : IChunithmMusicDatabaseApiResponse
    {
        IReadOnlyList<IMusic> AddedMusics { get; }
        IReadOnlyList<IMusic> DeletedMusics { get; }
    }
}
