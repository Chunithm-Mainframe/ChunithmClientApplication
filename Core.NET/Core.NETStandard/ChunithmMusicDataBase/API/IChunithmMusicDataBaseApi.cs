namespace ChunithmClientLibrary.ChunithmMusicDatabase.API
{
    public interface IChunithmMusicDatabaseApiRequest
    {
        string Command { get; }
    }

    public interface IChunithmMusicDatabaseApiResponse
    {
        bool Success { get; }
    }
}
