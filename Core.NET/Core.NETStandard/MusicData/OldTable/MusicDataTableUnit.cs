using ChunithmClientLibrary.ChunithmNet.Data;
using System;
using System.Runtime.Serialization;

namespace ChunithmClientLibrary.MusicData
{
    [DataContract]
    public sealed class MusicDataTableUnit : IMusicDataTableUnit
    {
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public string Genre { get; set; }

        [DataMember]
        public double BasicLevel { get; set; }
        [DataMember]
        public double AdvancedLevel { get; set; }
        [DataMember]
        public double ExpertLevel { get; set; }
        [DataMember]
        public double MasterLevel { get; set; }

        [DataMember]
        public bool BasicVerified { get; set; }
        [DataMember]
        public bool AdvancedVerified { get; set; }
        [DataMember]
        public bool ExpertVerified { get; set; }
        [DataMember]
        public bool MasterVerified { get; set; }

        public MusicDataTableUnit() { }

        public MusicDataTableUnit(IMusicDataTableUnit musicData)
        {
            Set(musicData);
        }

        public MusicDataTableUnit(MusicGenre.Unit unit)
        {
            if (unit == null)
            {
                throw new ArgumentNullException(nameof(unit));
            }

            Id = unit.Id;
            Name = unit.Name;
            Genre = unit.Genre;
        }

        public MusicDataTableUnit(MusicLevel.Unit unit)
        {
            if (unit == null)
            {
                throw new ArgumentNullException(nameof(unit));
            }

            Id = unit.Id;
            Name = unit.Name;
            SetBaseRating(unit.Difficulty, unit.Level);
        }

        public void Set(IMusicDataTableUnit musicData)
        {
            if (musicData == null)
            {
                throw new ArgumentNullException(nameof(musicData));
            }

            Id = musicData.Id;
            Name = musicData.Name;
            Genre = musicData.Genre;

            BasicLevel = musicData.GetBaseRating(Difficulty.Basic);
            AdvancedLevel = musicData.GetBaseRating(Difficulty.Advanced);
            ExpertLevel = musicData.GetBaseRating(Difficulty.Expert);
            MasterLevel = musicData.GetBaseRating(Difficulty.Master);

            BasicVerified = musicData.VerifiedBaseRating(Difficulty.Basic);
            AdvancedVerified = musicData.VerifiedBaseRating(Difficulty.Advanced);
            ExpertVerified = musicData.VerifiedBaseRating(Difficulty.Expert);
            MasterVerified = musicData.VerifiedBaseRating(Difficulty.Master);
        }

        public double GetBaseRating(Difficulty difficulty)
        {
            switch (difficulty)
            {
                case Difficulty.Basic:
                    return BasicLevel;
                case Difficulty.Advanced:
                    return AdvancedLevel;
                case Difficulty.Expert:
                    return ExpertLevel;
                case Difficulty.Master:
                    return MasterLevel;
            }

            return 0;
        }

        public void SetBaseRating(Difficulty difficulty, double baseRating)
        {
            switch (difficulty)
            {
                case Difficulty.Basic:
                    BasicLevel = baseRating;
                    break;
                case Difficulty.Advanced:
                    AdvancedLevel = baseRating;
                    break;
                case Difficulty.Expert:
                    ExpertLevel = baseRating;
                    break;
                case Difficulty.Master:
                    MasterLevel = baseRating;
                    break;
            }
        }

        public bool VerifiedBaseRating(Difficulty difficulty)
        {
            switch (difficulty)
            {
                case Difficulty.Basic:
                    return BasicVerified;
                case Difficulty.Advanced:
                    return AdvancedVerified;
                case Difficulty.Expert:
                    return ExpertVerified;
                case Difficulty.Master:
                    return MasterVerified;
            }

            return false;
        }

        public void SetVerifiedBaseRating(Difficulty difficulty, bool verified)
        {
            switch (difficulty)
            {
                case Difficulty.Basic:
                    BasicVerified = verified;
                    break;
                case Difficulty.Advanced:
                    AdvancedVerified = verified;
                    break;
                case Difficulty.Expert:
                    ExpertVerified = verified;
                    break;
                case Difficulty.Master:
                    MasterVerified = verified;
                    break;
            }
        }
    }
}