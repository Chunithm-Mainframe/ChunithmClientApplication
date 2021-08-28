using ChunithmClientLibrary;

namespace BeatsmapConstIdentifier
{
    public readonly struct MusicIdentifier
    {
        public static MusicIdentifier CreateByUniqueKey(int uniqueKey)
        {
            return new MusicIdentifier(uniqueKey / offset, (Difficulty)(uniqueKey % offset));
        }

        public int Id { get; }
        public Difficulty Difficulty { get; }

        public MusicIdentifier(int id, Difficulty difficulty)
        {
            Id = id;
            Difficulty = difficulty;
        }

        private const int offset = 100;

        public int ToUniqueKey()
        {
            return Id * offset + (int)Difficulty;
        }
    }
}
