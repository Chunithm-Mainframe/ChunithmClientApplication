using ChunithmClientLibrary.ChunithmMusicDatabase.API;
using ChunithmClientLibrary.Core;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector.Payloads
{
    namespace MusicRepositoryGet
    {
        public class Response : BaseResponse, IMusicRepositoryGetResponse
        {
            public IMusicRepository Repository { get; set; }
        }
    }

    namespace MusicRepositoryGet.Internal
    {
        [DataContract]
        internal class Request : Payloads.Internal.BaseRequest
        {
            public Request() : base(CommandName.MusicRepositoryGet) { }
        }

        [DataContract]
        internal class Response : Payloads.Internal.BaseResponse
        {
            [DataMember(Name = "musics")]
            public List<Structs.Music> Musics { get; }
        }
    }
}
