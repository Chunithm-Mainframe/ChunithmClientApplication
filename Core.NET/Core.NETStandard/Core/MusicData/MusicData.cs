using ChunithmClientLibrary.ChunithmNet.Data;
using System;
using System.Runtime.Serialization;

namespace ChunithmClientLibrary.Core
{
    [DataContract]
    public class MusicData : IMusicData
    {
        [DataMember(Name = "id")]
        public int Id { get; set; }

        [DataMember(Name = "name")]
        public string Name { get; set; }

        [DataMember(Name = "genre")]
        public string Genre { get; set; }

        [DataMember(Name = "difficulty")]
        public Difficulty Difficulty { get; set; }

        [DataMember(Name = "base_rating")]
        public double BaseRating { get; set; }

        [DataMember(Name = "verified")]
        public bool Verified { get; set; }

        public MusicData() { }

        public MusicData(IMusicData source) => Set(source);

        public MusicData(MusicGenre.Unit source)
        {
            _ = source ?? throw new ArgumentNullException(nameof(source));

            Id = source.Id;
            Name = source.Name;
            Genre = source.Genre;
            Difficulty = source.Difficulty;
        }

        public MusicData(MusicLevel.Unit source)
        {
            _ = source ?? throw new ArgumentNullException(nameof(source));

            Id = source.Id;
            Name = source.Name;
            Difficulty = source.Difficulty;
            BaseRating = source.Level;
        }

        public void Set(IMusicData source)
        {
            _ = source ?? throw new ArgumentNullException(nameof(source));

            Id = source.Id;
            Name = source.Name;
            Genre = source.Genre;
            Difficulty = source.Difficulty;
            BaseRating = source.BaseRating;
            Verified = source.Verified;
        }
    }
}
