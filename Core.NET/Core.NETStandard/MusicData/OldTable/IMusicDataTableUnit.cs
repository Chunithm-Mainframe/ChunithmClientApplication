using ChunithmClientLibrary.Table;

namespace ChunithmClientLibrary.MusicData
{
    public interface IMusicDataTableUnit : ITableUnit
    {
        int Id { get; }
        string Name { get; }
        string Genre { get; }
        double GetBaseRating(Difficulty difficulty);
        bool VerifiedBaseRating(Difficulty difficulty);
    }
}
