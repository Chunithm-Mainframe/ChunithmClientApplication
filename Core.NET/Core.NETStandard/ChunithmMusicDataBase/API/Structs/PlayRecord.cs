namespace ChunithmClientLibrary.ChunithmMusicDatabase.API.Structs
{
    public class PlayRecord : IPlayRecord
    {
        public int MasterMusicId { get; set; }
        public Difficulty Difficulty { get; set; }
        public int Score { get; set; }
    }
}
