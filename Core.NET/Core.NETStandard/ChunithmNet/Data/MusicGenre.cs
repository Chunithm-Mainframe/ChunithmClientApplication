namespace ChunithmClientLibrary.ChunithmNet.Data
{
    public class MusicGenre
    {
        public class Unit
        {
            public int Id { get; set; } = DefaultParameter.Id;
            public string Name { get; set; } = DefaultParameter.Name;
            public string Genre { get; set; } = DefaultParameter.Genre;
            public Difficulty Difficulty { get; set; } = DefaultParameter.Difficulty;
            public int Score { get; set; } = DefaultParameter.Score;
            public Rank Rank { get; set; } = DefaultParameter.Rank;
            public bool IsClear { get; set; } = DefaultParameter.IsClear;
            public ComboStatus ComboStatus { get; set; } = DefaultParameter.ComboStatus;
            public ChainStatus ChainStatus { get; set; } = DefaultParameter.ChainStatus;
        }

        public int MusicCount { get; set; }
        public int ClearCount { get; set; }
        public int SCount { get; set; }
        public int SaCount { get; set; }
        public int SsCount { get; set; }
        public int SsaCount { get; set; }
        public int SssCount { get; set; }
        public int SssaCount { get; set; }
        public int FullComboCount { get; set; }
        public int AllJusticeCount { get; set; }
        public int FullChainGoldCount { get; set; }
        public int FullChainPlatinumCount { get; set; }

        public Unit[] Units { get; set; } = new Unit[0];
    }
}
