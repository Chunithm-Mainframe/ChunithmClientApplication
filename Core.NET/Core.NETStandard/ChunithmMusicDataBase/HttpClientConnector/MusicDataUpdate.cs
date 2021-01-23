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
        private class InternalMusicDataUpdateRequest : ChunithmMusicDatabaseApiRequest
        {
            [DataMember(Name = "command")]
            public string Command { get; set; } = CommandName.MusicDataUpdate;

            [DataMember(Name = "music_datas")]
            public IReadOnlyList<IMusicData> MusicDatas;
        }

        [DataContract]
        private class InternalMusicDataUpdateResponse : ChunithmMusicDatabaseApiResponse
        {
            [DataMember]
            public IReadOnlyList<IMusicData> UpdatedMusicDatas = new List<IMusicData>();
        }

        private class MusicDataUpdateResponse : IMusicDataUpdateResponse
        {
            public IReadOnlyList<IMusicData> UpdatedMusicDatas { get; private set; }

            public bool Success { get; private set; }

            public MusicDataUpdateResponse(InternalMusicDataUpdateResponse response)
            {
                UpdatedMusicDatas = response.UpdatedMusicDatas.ToList();
                Success = response.Success;
            }
        }

        public async Task<IMusicDataUpdateResponse> UpdateMusicDataAsync(IEnumerable<IMusicData> musicDatas)
        {
            var resposne = UpdateMusicDataAsync(new InternalMusicDataUpdateRequest
            {
                MusicDatas = musicDatas.Select(m => new Core.MusicData(m)).ToList(),
            });
            await resposne;
            return new MusicDataUpdateResponse(resposne.Result);
        }

        private async Task<InternalMusicDataUpdateResponse> UpdateMusicDataAsync(InternalMusicDataUpdateRequest request)
        {
            var postAsync = client.PostAsync(Url, new StringContent(Utility.SerializeToJson(request), Encoding.UTF8, "application/json"));
            await postAsync;

            postAsync.Result.EnsureSuccessStatusCode();

            var readResponse = postAsync.Result.Content.ReadAsStringAsync();
            await readResponse;

            var response = Utility.DeserializeFromJson<InternalMusicDataUpdateResponse>(readResponse.Result);
            return response;
        }
    }
}
