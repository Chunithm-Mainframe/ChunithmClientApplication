using ChunithmClientLibrary.ChunithmMusicDatabase.API;
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector
{
    public sealed partial class ChunithmMusicDatabaseHttpClientConnector : IChunithmMusicDatabaseConnector, IDisposable
    {
        public string Url { get; }

        private HttpClient client = new HttpClient();

        public ChunithmMusicDatabaseHttpClientConnector(string url)
        {
            Url = url;
        }

        private async Task<TResponse> PostAsync<TRequest, TResponse>(TRequest request)
        {
            var response = await client.PostAsync(Url, new StringContent(Utility.SerializeToJson(request), Encoding.UTF8, "application/json"));
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            return Utility.DeserializeFromJson<TResponse>(content);
        }

        public void Dispose()
        {
            client.Dispose();
            client = null;
        }
    }
}
