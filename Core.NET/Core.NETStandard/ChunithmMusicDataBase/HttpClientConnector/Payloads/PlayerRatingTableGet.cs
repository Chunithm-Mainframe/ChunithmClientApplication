using ChunithmClientLibrary.ChunithmMusicDatabase.API;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector.Payloads
{
    namespace PlayerRatingTableGet
    {
        public class Response : BaseResponse, IPlayerRatingTableGetResponse
        {
            public IPlayerRatingTable Table { get; set; }
        }
    }

    namespace PlayerRatingTableGet.Internal
    {
        [DataContract]
        internal class Request : Payloads.Internal.BaseRequest
        {
            public Request() : base(CommandName.PlayerRatingTableGet) { }
        }

        [DataContract]
        internal class Response : Payloads.Internal.BaseResponse
        {
            [DataMember(Name = "records")]
            public List<Structs.PlayerRating> Records { get; set; }
        }
    }
}
