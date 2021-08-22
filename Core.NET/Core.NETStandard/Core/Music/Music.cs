using System;

namespace ChunithmClientLibrary.Core
{
    public class Music : IMusic
    {
        public IMasterMusic MasterMusic { get; set; }
        public Difficulty Difficulty { get; set; }
        public double BaseRating { get; set; }
        public bool Verified { get; set; }

        public Music()
        {
        }

        public Music(IMasterMusic masterMusic, IMusicRating musicRating)
        {
            Set(masterMusic, musicRating);
        }

        public void Set(IMasterMusic masterMusic, IMusicRating musicRating)
        {
            _ = masterMusic ?? throw new ArgumentNullException(nameof(masterMusic));

            if (masterMusic.Id != musicRating.MasterMusicId)
            {
                throw new ArgumentException($"IDs do not match. IMasterMusic.Id={masterMusic.Id}, IMusicRating.Id={musicRating.MasterMusicId}");
            }

            Set(masterMusic,
                musicRating.Difficulty,
                musicRating.BaseRating,
                musicRating.Verified);
        }

        public void Set(IMasterMusic masterMusic, Difficulty difficulty, double baseRating, bool verified)
        {
            MasterMusic = masterMusic;
            Difficulty = difficulty;
            BaseRating = baseRating;
            Verified = verified;
        }
    }
}
