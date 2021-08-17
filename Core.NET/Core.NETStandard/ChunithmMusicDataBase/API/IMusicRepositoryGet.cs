using ChunithmClientLibrary.Core;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.API
{
    public partial interface IChunithmMusicDatabaseConnector : IMusicRepositoryGet
    {
    }

    public interface IMusicRepositoryGet
    {
        Task<IMusicRepositoryGetResponse> GetMusicRepositoryAsync();
    }

    public interface IMusicRepositoryGetResponse : IChunithmMusicDatabaseApiResponse
    {
        IMusicRepository Repository { get; }
    }
}
