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
        private class TableUpdateRequest : ChunithmMusicDatabaseApiRequest, ITableUpdateRequest
        {
            [DataMember]
            public string Command { get; set; } = CommandName.TableUpdate;

            [DataMember]
            public List<Core.MusicData> MusicDatas { get; set; }

            IReadOnlyList<IMusicData> ITableUpdateRequest.MusicDatas
            {
                get { return MusicDatas.Cast<IMusicData>().ToList(); }
            }
        }

        [DataContract]
        private class TableUpdateResponse : ChunithmMusicDatabaseApiResponse, ITableUpdateResponse
        {
            [DataMember]
            public MusicDataTable MusicDataTable { get; set; }

            IMusicDataTable ITableUpdateResponse.MusicDataTable
            {
                get { return MusicDataTable; }
            }
        }

        public Task<ITableUpdateResponse> UpdateTableAsync(IEnumerable<IMusicData> musicDatas)
        {
            return UpdateTableAsync(musicDatas.Select(m => new Core.MusicData(m)).ToList());
        }

        public Task<ITableUpdateResponse> UpdateTableAsync(List<Core.MusicData> musicDatas)
        {
            return UpdateTableAsync(new TableUpdateRequest
            {
                MusicDatas = musicDatas
            });
        }

        public async Task<ITableUpdateResponse> UpdateTableAsync(ITableUpdateRequest request)
        {
            var postAsync = client.PostAsync(Url, new StringContent(Utility.SerializeToJson(request), Encoding.UTF8, "application/json"));
            await postAsync;

            postAsync.Result.EnsureSuccessStatusCode();

            var readResponse = postAsync.Result.Content.ReadAsStringAsync();
            await readResponse;

            var response = Utility.DeserializeFromJson<TableUpdateResponse>(readResponse.Result);
            return response;
        }
    }
}
