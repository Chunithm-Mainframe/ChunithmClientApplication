using System.Collections.Generic;
using System.Runtime.Serialization;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector.Structs
{
    [DataContract]
    public class PlayerRating
    {
        [DataMember(Name = "id")]
        public int Id { get; set; }

        [DataMember(Name = "best")]
        public List<PlayRecord> BestRecords { get; set; }

        [DataMember(Name = "outsideBest")]
        public List<PlayRecord> OutsideBestRecords { get; set; }

        [DataMember(Name = "recent")]
        public List<PlayRecord> RecentRecords { get; set; }
    }
}
