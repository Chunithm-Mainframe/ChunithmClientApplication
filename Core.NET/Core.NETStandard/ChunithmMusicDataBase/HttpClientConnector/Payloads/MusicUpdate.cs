using ChunithmClientLibrary.ChunithmMusicDatabase.API;
using ChunithmClientLibrary.Core;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector.Payloads
{
    namespace MusicUpdate
    {
        public class Request : BaseRequest, IMusicUpdateRequest
        {
            public IReadOnlyList<(int id, Difficulty difficulty, double baseRating)> Musics { get; set; }
        }

        public class Response : BaseResponse, IMusicUpdateResponse
        {
            public IReadOnlyList<(int id, Difficulty difficulty, double baseRating)> UpdatedMusics { get; set; }
        }
    }

    namespace MusicUpdate.Internal
    {
        [DataContract]
        internal class Request : Payloads.Internal.BaseRequest
        {
            [DataMember(Name = "musics")]
            public List<Structs.Music> Musics { get; set; }

            public Request() : base(CommandName.MusicUpdate) { }
        }

        [DataContract]
        internal class Response : Payloads.Internal.BaseResponse
        {
            [DataMember(Name = "updated")]
            public List<Structs.MusicRating> UpdatedMusics { get; set; }
        }
    }
}
