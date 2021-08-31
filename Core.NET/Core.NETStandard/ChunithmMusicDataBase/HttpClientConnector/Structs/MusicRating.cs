using System.Runtime.Serialization;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector.Structs
{
    [DataContract]
    public class MusicRating
    {
        [DataMember(Name = "id")]
        public int MasterMusicId { get; set; }

        [DataMember(Name = "difficulty")]
        public Difficulty Difficulty { get; set; }

        [DataMember(Name = "baseRating")]
        public double BaseRating { get; set; }
    }
}
