using ChunithmClientLibrary.Core;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.API
{
    public partial interface IChunithmMusicDatabaseConnector : IMusicTableGet
    {
    }

    public interface IMusicTableGet
    {
        Task<IMusicTableGetResponse> GetMusicTableAsync();
    }

    public interface IMusicTableGetResponse : IChunithmMusicDatabaseApiResponse
    {
        IMusicRepository Repository { get; }
    }
}
