﻿using ChunithmClientLibrary.ChunithmMusicDatabase.API;
using ChunithmClientLibrary.Core;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector.Payloads
{
    namespace MusicTableUpdate
    {
        public class Request : BaseRequest, IMusicTableUpdateRequest
        {
            public IReadOnlyList<IMusic> Musics { get; set; }
        }

        public class Response : BaseResponse, IMusicTableUpdateResponse
        {
            public IReadOnlyList<IMusic> AddedMusics { get; set; }
            public IReadOnlyList<IMusic> DeletedMusics { get; set; }
        }
    }

    namespace MusicTableUpdate.Internal
    {
        [DataContract]
        internal class Request : Payloads.Internal.BaseRequest
        {
            [DataMember(Name = "musics")]
            public List<Structs.Music> Musics { get; set; }

            public Request() : base(CommandName.MusicTableUpdate) { }
        }

        [DataContract]
        internal class Response : Payloads.Internal.BaseResponse
        {
            [DataMember(Name = "added")]
            public List<Structs.Music> AddedMusics { get; set; }

            [DataMember(Name = "deleted")]
            public List<Structs.Music> DeletedMusics { get; set; }
        }
    }
}
