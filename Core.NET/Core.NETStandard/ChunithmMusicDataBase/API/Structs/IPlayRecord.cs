namespace ChunithmClientLibrary.ChunithmMusicDatabase.API.Structs
{
    public interface IPlayRecord
    {
        int MasterMusicId { get; }
        Difficulty Difficulty { get; }
        int Score { get; }
    }
}
