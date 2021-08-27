namespace BeatsmapConstIdentifier
{
    public readonly struct BaseRatingRange
    {
        public int LowerLimit { get; }
        public int UpperLimit { get; }

        public BaseRatingRange(int lowerLimit, int upperLimit)
        {
            LowerLimit = lowerLimit;
            UpperLimit = upperLimit;
        }

        public bool IsValid()
        {
            return LowerLimit <= UpperLimit;
        }
    }
}
