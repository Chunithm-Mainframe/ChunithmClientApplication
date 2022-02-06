using ChunithmClientLibrary.ChunithmNet.API;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.ChunithmNet.Parser;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmNet.HttpClientConnector
{
    public partial class ChunithmNetHttpClientConnector
    {
        private class MusicGenreGetRequest : IMusicGenreGetRequest
        {
            public int GenreCode { get; set; }
            public Difficulty Difficulty { get; set; }
        }

        private class MusicGenreGetResponse : ChunithmNetApiResponse, IMusicGenreGetResponse
        {
            public MusicGenre MusicGenre { get; set; }
            public MusicGenreGetResponse(HttpResponseMessage message) : base(message) { }
        }

        public Task<IMusicGenreGetResponse> GetMusicGenreAsync(int genreCode, Difficulty difficulty)
        {
            var request = new MusicGenreGetRequest
            {
                GenreCode = genreCode,
                Difficulty = difficulty,
            };
            return GetMusicGenreAsync(request);
        }

        public async Task<IMusicGenreGetResponse> GetMusicGenreAsync(IMusicGenreGetRequest request)
        {
            var musicGenreContent = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                { "genre", request.GenreCode.ToString() },
                { "token", token },
            });

            var musicGenreRequest = client.PostAsync(ChunithmNetUrl.CreateUrl(GetPostPath(request.Difficulty)), musicGenreContent);
            await musicGenreRequest;

            var musicGenre = client.GetAsync(ChunithmNetUrl.CreateUrl(GetRequestPath(request.Difficulty)));
            await musicGenre;

            var response = new MusicGenreGetResponse(musicGenre.Result);
            if (response.Success)
            {
                response.MusicGenre = new MusicGenreParser().Parse(response.DocumentText);
            }

            return response;
        }

        private string GetPostPath(Difficulty difficulty)
        {
            switch (difficulty)
            {
                case Difficulty.Basic:
                    return CreateLocalPath("sendBasic");
                case Difficulty.Advanced:
                    return CreateLocalPath("sendAdvanced");
                case Difficulty.Expert:
                    return CreateLocalPath("sendExpert");
                case Difficulty.Master:
                    return CreateLocalPath("sendMaster");
                case Difficulty.Ultima:
                    return CreateLocalPath("sendUltima");
            }

            return CreateLocalPath("sendMaster");
        }

        private string GetRequestPath(Difficulty difficulty)
        {
            switch (difficulty)
            {
                case Difficulty.Basic:
                    return CreateLocalPath("basic");
                case Difficulty.Advanced:
                    return CreateLocalPath("advanced");
                case Difficulty.Expert:
                    return CreateLocalPath("expert");
                case Difficulty.Master:
                    return CreateLocalPath("master");
                case Difficulty.Ultima:
                    return CreateLocalPath("ultima");
            }

            return CreateLocalPath("master");
        }

        private string CreateLocalPath(string path)
        {
            return $"record/musicGenre/{path}";
        }
    }
}
