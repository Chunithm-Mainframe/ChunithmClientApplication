using ChunithmClientLibrary.ChunithmMusicDatabase.API;
using System.Runtime.Serialization;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector
{
    namespace Payloads
    {
        public class BaseRequest : IChunithmMusicDatabaseApiRequest
        {
        }

        public class BaseResponse : IChunithmMusicDatabaseApiResponse
        {
            public bool Success { get; set; }
        }
    }

    namespace Payloads.Internal
    {
        [DataContract]
        internal class BaseRequest
        {
            [DataMember(Name = "command")]
            public string Command { get; set; }

            public BaseRequest(string command)
            {
                Command = command;
            }
        }

        [DataContract]
        internal class BaseResponse
        {
            [DataMember(Name = "Success")]
            public bool Success { get; set; }
        }
    }
}
