namespace BeatsmapConstIdentifier
{
    public class Song
    {
        public int Id { get; }
        public int LowerLimit { get; }
        public int UpperLimit { get; }

        public Song(int id, int lowerLimit, int upperLimit)
        {
            Id = id;
            LowerLimit = lowerLimit;
            UpperLimit = upperLimit;
        }

        public bool IsValid()
        {
            return LowerLimit <= UpperLimit;
        }
    }
}
