using ChunithmClientLibrary;

namespace BeatsmapConstIdentifier
{
    public readonly struct MusicRating
    {
        public int Id { get; }
        public Difficulty Difficulty { get; }
        public int LowerLimit { get; }
        public int UpperLimit { get; }

        public bool Established => LowerLimit == UpperLimit;
        public double BaseRating => LowerLimit / 100.0;

        public MusicRating(MusicIdentifier identifier, BaseRatingRange baseRatingRange)
        {
            Id = identifier.Id;
            Difficulty = identifier.Difficulty;
            LowerLimit = baseRatingRange.LowerLimit;
            UpperLimit = baseRatingRange.UpperLimit;
        }

        public MusicRating(int id, Difficulty difficulty, int lowerLimit, int upperLimit)
        {
            Id = id;
            Difficulty = difficulty;
            LowerLimit = lowerLimit;
            UpperLimit = upperLimit;
        }

        public MusicIdentifier ToMusicIdentifier()
        {
            return new MusicIdentifier(Id, Difficulty);
        }

        public BaseRatingRange ToBaseRatingRange()
        {
            return new BaseRatingRange(LowerLimit, UpperLimit);
        }
    }
}
