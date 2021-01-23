using ChunithmClientLibrary.Core;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.API
{
    public partial interface IChunithmMusicDatabaseConnector : IMusicDataUpdate
    {
    }

    public interface IMusicDataUpdate
    {
        Task<IMusicDataUpdateResponse> UpdateMusicDataAsync(IEnumerable<IMusicData> musicDatas);
    }

    public interface IMusicDataUpdateRequest : IChunithmMusicDatabaseApiRequest
    {
        IList<IMusicData> MusicDatas { get; }
    }

    public interface IMusicDataUpdateResponse : IChunithmMusicDatabaseApiResponse
    {
        IReadOnlyList<IMusicData> UpdatedMusicDatas { get; }
    }
}
