using ChunithmClientLibrary.ChunithmMusicDatabase.API;
using ChunithmClientLibrary.Core;
using System.Linq;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector
{
    using InternalRequest = Payloads.MusicTableGet.Internal.Request;
    using InternalResponse = Payloads.MusicTableGet.Internal.Response;
    using Response = Payloads.MusicTableGet.Response;

    public partial class ChunithmMusicDatabaseHttpClientConnector
    {
        public async Task<IMusicTableGetResponse> GetMusicTableAsync()
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
