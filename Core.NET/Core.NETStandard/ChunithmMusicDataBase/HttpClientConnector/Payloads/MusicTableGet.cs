using ChunithmClientLibrary.ChunithmMusicDatabase.API;
using ChunithmClientLibrary.Core;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector.Payloads
{
    namespace MusicTableGet
    {
        public class Response : BaseResponse, IMusicTableGetResponse
        {
            public IMusicRepository Repository { get; set; }
        }
    }

    namespace MusicTableGet.Internal
    {
        [DataContract]
        internal class Request : Payloads.Internal.BaseRequest
        {
            public Request() : base(CommandName.MusicTableGet) { }
        }

        [DataContract]
        internal class Response : Payloads.Internal.BaseResponse
        {
            [DataMember(Name = "musics")]
            public List<Structs.Music> Musics { get; }
        }
    }
}
