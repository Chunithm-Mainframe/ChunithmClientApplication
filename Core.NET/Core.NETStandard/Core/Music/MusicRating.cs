using ChunithmClientLibrary.ChunithmNet.Data;

namespace ChunithmClientLibrary.Core
{
    public class MusicRating : IMusicRating
    {
        public int MasterMusicId { get; set; }
        public Difficulty Difficulty { get; set; }
        public double BaseRating { get; set; }
        public bool Verified { get; set; }

        public MusicRating()
        {
        }

        public MusicRating(MusicLevel.Unit unit)
        {
            _ = unit ?? throw new System.ArgumentNullException(nameof(unit));

            Set(unit.Id, unit.Difficulty, unit.Level, false);
        }

        public void Set(int masterMusicId, Difficulty difficulty, double baseRating, bool verifed)
        {
            MasterMusicId = masterMusicId;
            Difficulty = difficulty;
            BaseRating = baseRating;
            Verified = verifed;
        }
    }
}
