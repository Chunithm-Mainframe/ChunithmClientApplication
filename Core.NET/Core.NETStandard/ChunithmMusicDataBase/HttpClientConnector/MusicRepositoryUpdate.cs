using ChunithmClientLibrary.ChunithmMusicDatabase.API;
using ChunithmClientLibrary.Core;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector
{
    public partial class ChunithmMusicDatabaseHttpClientConnector
    {
        [DataContract]
        private class InternalMusicRepositoryUpdateRequest : ChunithmMusicDatabaseApiRequest
        {
            [DataContract]
            public class Music
            {
                [DataMember] public int id;
                [DataMember] public string name;
                [DataMember] public string genre;
                [DataMember] public double basicBaseRating;
                [DataMember] public double advancedBaseRating;
                [DataMember] public double expertBaseRating;
                [DataMember] public double masterBaseRating;
                [DataMember] public bool basicVerified;
                [DataMember] public bool advancedVerified;
                [DataMember] public bool expertVerified;
                [DataMember] public bool masterVerified;

                public static Music Instantiate(IReadOnlyDictionary<Difficulty, IMusic> musicTable)
                {
                    var masterMusic = musicTable.Values.First().MasterMusic;

                    return new Music
                    {
                        id = masterMusic.Id,
                        name = masterMusic.Name,
                        genre = masterMusic.Genre,
                        basicBaseRating = musicTable[Difficulty.Basic].BaseRating,
                        advancedBaseRating = musicTable[Difficulty.Advanced].BaseRating,
                        expertBaseRating = musicTable[Difficulty.Expert].BaseRating,
                        masterBaseRating = musicTable[Difficulty.Master].BaseRating,
                        basicVerified = musicTable[Difficulty.Basic].Verified,
                        advancedVerified = musicTable[Difficulty.Advanced].Verified,
                        expertVerified = musicTable[Difficulty.Expert].Verified,
                        masterVerified = musicTable[Difficulty.Master].Verified,
                    };
                }
            }

            [DataMember] public string command = CommandName.MusicRepositoryUpdate;
            [DataMember] public List<Music> musics;
        }

        [DataContract]
        private class InternalMusicRepositoryUpdateResponse : ChunithmMusicDatabaseApiResponse
        {
            [DataMember] public List<InternalMusicRepositoryUpdateRequest.Music> added;
            [DataMember] public List<InternalMusicRepositoryUpdateRequest.Music> deleted;
        }

        private class MusicRepositoryUpdateResponse : IMusicRepositoryUpdateResponse
        {
            public IReadOnlyList<IMusic> AddedMusics { get; set; }

            public IReadOnlyList<IMusic> DeletedMusics { get; set; }

            public bool Success { get; set; }
        }

        public async Task<IMusicRepositoryUpdateResponse> UpdateMusicRepositoryAsync(IEnumerable<IMusic> musics)
        {
            var rawRequest = new InternalMusicRepositoryUpdateRequest
            {
                musics = musics.GroupBy(x => x.MasterMusic.Id).Select(x => InternalMusicRepositoryUpdateRequest.Music.Instantiate(x.ToDictionary(y => y.Difficulty))).ToList()
            };
            var postAsync = client.PostAsync(Url, new StringContent(Utility.SerializeToJson(rawRequest), Encoding.UTF8, "application/json"));
            await postAsync;

            postAsync.Result.EnsureSuccessStatusCode();

            var readResponse = postAsync.Result.Content.ReadAsStringAsync();
            await readResponse;

            var response = Utility.DeserializeFromJson<InternalMusicRepositoryUpdateResponse>(readResponse.Result);
            return new MusicRepositoryUpdateResponse
            {
                Success = response.Success,
                AddedMusics = response.added?.SelectMany(ConvertToModels).ToList() ?? new List<Music>(),
                DeletedMusics = response.deleted?.SelectMany(ConvertToModels).ToList() ?? new List<Music>(),
            };
        }

        public Task<IMusicRepositoryUpdateResponse> UpdateMusicRepositoryAsync(IMusicRepositoryUpdateRequest request)
        {
            return UpdateMusicRepositoryAsync(request.Musics);
        }

        private Music[] ConvertToModels(InternalMusicRepositoryUpdateRequest.Music music)
        {
            var masterMusic = new MasterMusic
            {
                Id = music.id,
                Name = music.name,
                Genre = music.genre,
            };

            return new Music[]
            {
                ConvertToModel(masterMusic, Difficulty.Basic, music.basicBaseRating, music.basicVerified),
                ConvertToModel(masterMusic, Difficulty.Advanced, music.advancedBaseRating, music.advancedVerified),
                ConvertToModel(masterMusic, Difficulty.Expert, music.expertBaseRating, music.expertVerified),
                ConvertToModel(masterMusic, Difficulty.Master, music.masterBaseRating, music.masterVerified),
            };
        }

        private Music ConvertToModel(IMasterMusic masterMusic, Difficulty difficulty, double baseRating, bool verified)
        {
            return new Music
            {
                MasterMusic = masterMusic,
                Difficulty = difficulty,
                BaseRating = baseRating,
                Verified = verified,
            };
        }
    }
}
