using ChunithmClientLibrary.ChunithmMusicDatabase.API;
using ChunithmClientLibrary.Core;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector
{
    using InternalRequest = Payloads.MusicUpdate.Internal.Request;
    using InternalResponse = Payloads.MusicUpdate.Internal.Response;
    using Response = Payloads.MusicUpdate.Response;

    public partial class ChunithmMusicDatabaseHttpClientConnector
    {
        public Task<IMusicUpdateResponse> UpdateMusicAsync(IMusicUpdateRequest request)
        {
            return UpdateMusicAsync(request.Musics);
        }

        public Task<IMusicUpdateResponse> UpdateMusicAsync(IEnumerable<IMusic> musics)
        {
            return UpdateMusicAsync(musics.Select(x => (x.MasterMusic.Id, x.Difficulty, x.BaseRating)));
        }

        public async Task<IMusicUpdateResponse> UpdateMusicAsync(IEnumerable<(int id, Difficulty difficulty, double baseRating)> musics)
        {
            var musicTempMap = new Dictionary<int, Structs.Music>();
            foreach (var (id, difficulty, baseRating) in musics)
            {
                if (!musicTempMap.TryGetValue(id, out var tmp))
                {
                    tmp = new Structs.Music
                    {
                        Id = id
                    };
                    musicTempMap.Add(tmp.Id, tmp);
                }

                switch (difficulty)
                {
                    case Difficulty.Basic:
                        tmp.BasicBaseRating = baseRating;
                        tmp.BasicVerified = true;
                        break;
                    case Difficulty.Advanced:
                        tmp.AdvancedBaseRating = baseRating;
                        tmp.AdvancedVerified = true;
                        break;
                    case Difficulty.Expert:
                        tmp.ExpertBaseRating = baseRating;
                        tmp.ExpertVerified = true;
                        break;
                    case Difficulty.Master:
                        tmp.MasterBaseRating = baseRating;
                        tmp.MasterVerified = true;
                        break;
                    case Difficulty.Ultima:
                        tmp.UltimaBaseRating = baseRating;
                        tmp.UltimaVerified = true;
                        break;
                }
            }

            var internalRequest = new InternalRequest
            {
                Musics = musicTempMap.Values.ToList()
            };

            var internalResponse = await PostAsync<InternalRequest, InternalResponse>(internalRequest);

            return new Response
            {
                Success = internalResponse.Success,
                UpdatedMusics = internalResponse.UpdatedMusics.Select(x => (x.MasterMusicId, x.Difficulty, x.BaseRating)).ToList(),
            };
        }
    }
}
