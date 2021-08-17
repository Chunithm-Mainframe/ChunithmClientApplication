using ChunithmClientLibrary.Core;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.API
{
    public partial interface IChunithmMusicDatabaseConnector : IMusicRepositoryUpdate
    {
    }

    public interface IMusicRepositoryUpdate
    {
        Task<IMusicRepositoryUpdateResponse> UpdateMusicRepositoryAsync(IEnumerable<IMusic> musics);
        Task<IMusicRepositoryUpdateResponse> UpdateMusicRepositoryAsync(IMusicRepositoryUpdateRequest request);
    }

    public interface IMusicRepositoryUpdateRequest : IChunithmMusicDatabaseApiRequest
    {
        IReadOnlyList<IMusic> Musics { get; }
    }

    public interface IMusicRepositoryUpdateResponse : IChunithmMusicDatabaseApiResponse
    {
        IReadOnlyList<IMusic> AddedMusics { get; }
        IReadOnlyList<IMusic> DeletedMusics { get; }
    }
}
