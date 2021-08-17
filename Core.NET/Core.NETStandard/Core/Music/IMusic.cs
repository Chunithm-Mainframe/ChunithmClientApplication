namespace ChunithmClientLibrary.Core
{
    public interface IMusic
    {
        IMasterMusic MasterMusic { get; }
        Difficulty Difficulty { get; }
        double BaseRating { get; }
        bool Verified { get; }
    }
}
