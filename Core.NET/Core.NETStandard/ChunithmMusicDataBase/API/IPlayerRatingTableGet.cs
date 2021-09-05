using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.API
{
    public partial interface IChunithmMusicDatabaseConnector : IPlayerRatingTableGet
    {
    }

    public interface IPlayerRatingTableGet
    {
        Task<IPlayerRatingTableGetResponse> GetPlayerRatingTableAsync();
    }

    public interface IPlayerRatingTableGetResponse : IChunithmMusicDatabaseApiResponse
    {
        IPlayerRatingTable Table { get; }
    }
}
