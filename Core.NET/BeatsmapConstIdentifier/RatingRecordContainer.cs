using ChunithmClientLibrary;
using System.Collections.Generic;

namespace BeatsmapConstIdentifier
{
    public class RatingRecordContainer
    {
        public readonly struct Reocrd
        {
            public int Id { get; }
            public Difficulty Difficulty { get; }
            public int Score { get; }
            public int Offset { get; }

            public Reocrd(int id, Difficulty difficulty, int score)
            {
                Id = id;
                Difficulty = difficulty;
                Score = score;
                Offset = Utility.ScoreToOffset(score);
            }

            public MusicIdentifier ToMusicIdentifier()
            {
                return new MusicIdentifier(Id, Difficulty);
            }
        }

        public readonly List<Reocrd> Records = new();
    }
}
