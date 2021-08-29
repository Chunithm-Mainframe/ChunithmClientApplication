using System.Runtime.Serialization;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector.Structs
{
    [DataContract]
    public class PlayRecord
    {
        [DataMember(Name = "id")]
        public int MasterMusicId { get; set; }

        [DataMember(Name = "difficulty")]
        public Difficulty Difficulty { get; set; }

        [DataMember(Name = "score")]
        public int Score { get; set; }
    }
}
