﻿namespace ChunithmClientLibrary.ChunithmNet.Data
{
    public class MusicLevel
    {
        public class Unit
        {
            public int Id { get; set; } = DefaultParameter.Id;
            public string Name { get; set; } = DefaultParameter.Name;
            public Difficulty Difficulty { get; set; } = DefaultParameter.Difficulty;
            public double Level { get; set; } = DefaultParameter.Level;
            public int Score { get; set; } = DefaultParameter.Score;
            public Rank Rank { get; set; } = DefaultParameter.Rank;
            public bool IsClear { get; set; } = DefaultParameter.IsClear;
            public ComboStatus ComboStatus { get; set; } = DefaultParameter.ComboStatus;
            public ChainStatus ChainStatus { get; set; } = DefaultParameter.ChainStatus;
        }

        public int MusicCount { get; set; }
        public int ClearCount { get; set; }
        public int SCount { get; set; }
        public int SsCount { get; set; }
        public int SssCount { get; set; }
        public int FullComboCount { get; set; }
        public int AllJusticeCount { get; set; }
        public int FullChainGoldCount { get; set; }
        public int FullChainPlatinumCount { get; set; }

        public Unit[] Units { get; set; } = new Unit[0];
    }
}
