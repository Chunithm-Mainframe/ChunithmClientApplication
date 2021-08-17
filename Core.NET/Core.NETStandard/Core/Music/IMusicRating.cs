namespace ChunithmClientLibrary.Core
{
    public interface IMusicRating
    {
        int MasterMusicId { get; }
        Difficulty Difficulty { get; }
        double BaseRating { get; }
        bool Verified { get; }
    }
}
