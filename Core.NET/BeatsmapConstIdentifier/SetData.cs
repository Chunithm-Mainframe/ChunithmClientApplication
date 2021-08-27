using System.Collections.Generic;

namespace BeatsmapConstIdentifier
{
    public class SetData
    {
        public class Unit
        {
            public int SongId { get; }
            public int Score { get; }
            public int Offset { get; }

            public Unit(int songId, int score)
            {
                SongId = songId;
                Score = score;
                Offset = Utility.ScoreToOffset(score);
            }
        }

        public readonly List<Unit> Units = new();
    }
}
