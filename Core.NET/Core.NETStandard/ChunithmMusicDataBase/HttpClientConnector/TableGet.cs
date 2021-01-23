using ChunithmClientLibrary.ChunithmMusicDatabase.API;
using ChunithmClientLibrary.Core;
using System.Net.Http;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector
{
    public partial class ChunithmMusicDatabaseHttpClientConnector
    {
        [DataContract]
        private class TableGetRequest : ChunithmMusicDatabaseApiRequest, ITableGetRequest
        {
            [DataMember]
            public string Command { get; set; } = CommandName.TableGet;
        }

        [DataContract]
        private class TableGetResponse : ChunithmMusicDatabaseApiResponse, ITableGetResponse
        {
            [DataMember]
            public MusicDataTable MusicDataTable { get; set; }

            IMusicDataTable ITableGetResponse.MusicDataTable
            {
                get { return MusicDataTable; }
            }
        }

        public Task<ITableGetResponse> GetTableAsync()
        {
            return GetTableAsync(new TableGetRequest
            {
            });
        }

        public async Task<ITableGetResponse> GetTableAsync(ITableGetRequest request)
        {
            var postAsync = client.PostAsync(Url, new StringContent(Utility.SerializeToJson(request), Encoding.UTF8, "application/json"));
            await postAsync;

            postAsync.Result.EnsureSuccessStatusCode();

            var readResponse = postAsync.Result.Content.ReadAsStringAsync();
            await readResponse;

            var response = Utility.DeserializeFromJson<TableGetResponse>(readResponse.Result);
            return response;
        }
    }
}
