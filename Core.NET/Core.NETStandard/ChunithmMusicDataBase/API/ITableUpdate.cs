using ChunithmClientLibrary.Core;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.API
{
    public partial interface IChunithmMusicDatabaseConnector : ITableUpdate
    {
    }

    public interface ITableUpdate
    {
        Task<ITableUpdateResponse> UpdateTableAsync(IEnumerable<IMusicData> musicDatas);
        Task<ITableUpdateResponse> UpdateTableAsync(ITableUpdateRequest request);
    }

    public interface ITableUpdateRequest : IChunithmMusicDatabaseApiRequest
    {
        IReadOnlyList<IMusicData> MusicDatas { get; }
    }

    public interface ITableUpdateResponse : IChunithmMusicDatabaseApiResponse
    {
        IMusicDataTable MusicDataTable { get; }
    }
}
