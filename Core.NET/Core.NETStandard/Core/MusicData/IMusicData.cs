namespace ChunithmClientLibrary.Core
{
    public interface IMusicData
    {
        int Id { get; }
        string Name { get; }
        string Genre { get; }
        Difficulty Difficulty { get; }
        double BaseRating { get; }
        bool Verified { get; }
    }
}
