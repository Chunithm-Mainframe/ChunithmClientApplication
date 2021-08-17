namespace ChunithmClientLibrary.Core
{
    public class MusicRating : IMusicRating
    {
        public MusicRating()
        {
        }

        public int MasterMusicId { get; set; }
        public Difficulty Difficulty { get; set; }
        public double BaseRating { get; set; }
        public bool Verified { get; set; }
    }
}
