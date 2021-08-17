using ChunithmClientLibrary.ChunithmMusicDatabase.API;
using ChunithmClientLibrary.Core;
using System.Linq;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector
{
    using InternalRequest = Payloads.MusicRepositoryGet.Internal.Request;
    using InternalResponse = Payloads.MusicRepositoryGet.Internal.Response;
    using Response = Payloads.MusicRepositoryGet.Response;

    public partial class ChunithmMusicDatabaseHttpClientConnector
    {
        public async Task<IMusicRepositoryGetResponse> GetMusicRepositoryAsync()
        {
            var internalResponse = await PostAsync<InternalRequest, InternalResponse>(new InternalRequest());

            var repository = new MusicRepository();
            repository.Set(
                internalResponse.Musics.Select(x => x.GetMasterMusic()),
                internalResponse.Musics.SelectMany(x => x.GetMusicRatingMap().Values));

            return new Response
            {
                Success = internalResponse.Success,
                Repository = repository,
            };
        }
    }
}
