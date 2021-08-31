using ChunithmClientLibrary.Core;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector.Structs
{
    [DataContract]
    public class Music
    {
        [DataMember(Name = "id")]
        public int Id { get; set; }

        [DataMember(Name = "name")]
        public string Name { get; set; }

        [DataMember(Name = "genre")]
        public string Genre { get; set; }

        [DataMember(Name = "basicBaseRating")]
        public double BasicBaseRating { get; set; }

        [DataMember(Name = "advancedBaseRating")]
        public double AdvancedBaseRating { get; set; }

        [DataMember(Name = "expertBaseRating")]
        public double ExpertBaseRating;

        [DataMember(Name = "masterBaseRating")]
        public double MasterBaseRating;

        [DataMember(Name = "basicVerified")]
        public bool BasicVerified;

        [DataMember(Name = "advancedVerified")]
        public bool AdvancedVerified;

        [DataMember(Name = "expertVerified")]
        public bool ExpertVerified;

        [DataMember(Name = "masterVerified")]
        public bool MasterVerified;

        public static Music Instantiate(IReadOnlyDictionary<Difficulty, IMusic> musicTable)
        {
            var masterMusic = musicTable.Values.First().MasterMusic;
            return new Music
            {
                Id = masterMusic.Id,
                Name = masterMusic.Name,
                Genre = masterMusic.Genre,
                BasicBaseRating = musicTable[Difficulty.Basic].BaseRating,
                AdvancedBaseRating = musicTable[Difficulty.Advanced].BaseRating,
                ExpertBaseRating = musicTable[Difficulty.Expert].BaseRating,
                MasterBaseRating = musicTable[Difficulty.Master].BaseRating,
                BasicVerified = musicTable[Difficulty.Basic].Verified,
                AdvancedVerified = musicTable[Difficulty.Advanced].Verified,
                ExpertVerified = musicTable[Difficulty.Expert].Verified,
                MasterVerified = musicTable[Difficulty.Master].Verified,
            };
        }

        public IMasterMusic GetMasterMusic()
        {
            return new MasterMusic
            {
                Id = Id,
                Name = Name,
                Genre = Genre,
            };
        }

        public IReadOnlyDictionary<Difficulty, IMusicRating> GetMusicRatingMap()
        {
            var masterMusic = GetMasterMusic();

            return new Dictionary<Difficulty, IMusicRating>
            {
                { Difficulty.Basic, CreateMusicRating(masterMusic, Difficulty.Basic, BasicBaseRating, BasicVerified) },
                { Difficulty.Advanced, CreateMusicRating(masterMusic, Difficulty.Advanced, AdvancedBaseRating, AdvancedVerified) },
                { Difficulty.Expert, CreateMusicRating(masterMusic, Difficulty.Expert, ExpertBaseRating, ExpertVerified) },
                { Difficulty.Master, CreateMusicRating(masterMusic, Difficulty.Master, MasterBaseRating, MasterVerified) },
            };
        }

        private IMusicRating CreateMusicRating(IMasterMusic masterMusic, Difficulty difficulty, double baseRating, bool verified)
        {
            return new Core.MusicRating
            {
                MasterMusicId = masterMusic.Id,
                Difficulty = difficulty,
                BaseRating = baseRating,
                Verified = verified,
            };
        }

        public IReadOnlyDictionary<Difficulty, IMusic> GetModelMap()
        {
            var masterMusic = GetMasterMusic();

            return new Dictionary<Difficulty, IMusic>
            {
                { Difficulty.Basic, CreateModel(masterMusic, Difficulty.Basic, BasicBaseRating, BasicVerified) },
                { Difficulty.Advanced, CreateModel(masterMusic, Difficulty.Advanced, AdvancedBaseRating, AdvancedVerified) },
                { Difficulty.Expert, CreateModel(masterMusic, Difficulty.Expert, ExpertBaseRating, ExpertVerified) },
                { Difficulty.Master, CreateModel(masterMusic, Difficulty.Master, MasterBaseRating, MasterVerified) },
            };
        }

        private IMusic CreateModel(IMasterMusic masterMusic, Difficulty difficulty, double baseRating, bool verified)
        {
            return new Core.Music
            {
                MasterMusic = masterMusic,
                Difficulty = difficulty,
                BaseRating = baseRating,
                Verified = verified,
            };
        }
    }
}
