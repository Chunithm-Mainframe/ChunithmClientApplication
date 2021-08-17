using ChunithmClientLibrary.ChunithmMusicDatabase.API;
using ChunithmClientLibrary.Core;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector
{
    using InternalRequest = Payloads.MusicRepositoryUpdate.Internal.Request;
    using InternalResponse = Payloads.MusicRepositoryUpdate.Internal.Response;
    using Response = Payloads.MusicRepositoryUpdate.Response;

    public partial class ChunithmMusicDatabaseHttpClientConnector
    {
        public async Task<IMusicRepositoryUpdateResponse> UpdateMusicRepositoryAsync(IEnumerable<IMusic> musics)
        {
            var internalRequest = new InternalRequest
            {
                Musics = musics.GroupBy(x => x.MasterMusic.Id)
                    .Select(x => Structs.Music.Instantiate(x.ToDictionary(y => y.Difficulty)))
                    .ToList()
            };

            var internalResponse = await PostAsync<InternalRequest, InternalResponse>(internalRequest);

            return new Response
            {
                Success = internalResponse.Success,
                AddedMusics = internalResponse.AddedMusics?.SelectMany(x => x.GetModelMap().Values).ToList() ?? new List<IMusic>(),
                DeletedMusics = internalResponse.DeletedMusics?.SelectMany(x => x.GetModelMap().Values).ToList() ?? new List<IMusic>(),
            };
        }

        public Task<IMusicRepositoryUpdateResponse> UpdateMusicRepositoryAsync(IMusicRepositoryUpdateRequest request)
        {
            return UpdateMusicRepositoryAsync(request.Musics);
        }
    }
}
