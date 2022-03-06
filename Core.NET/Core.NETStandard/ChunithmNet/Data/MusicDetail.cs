using System;
using System.Linq;

namespace ChunithmClientLibrary.ChunithmNet.Data
{
    public class MusicDetail
    {
        public class Unit
        {
            public Difficulty Difficulty { get; set; } = DefaultParameter.Difficulty;
            public int Score { get; set; } = DefaultParameter.Score;
            public Rank Rank { get; set; } = DefaultParameter.Rank;

            public bool IsClear { get; set; } = DefaultParameter.IsClear;
            public ComboStatus ComboStatus { get; set; } = DefaultParameter.ComboStatus;
            public ChainStatus ChainStatus { get; set; } = DefaultParameter.ChainStatus;

            public int PlayCount { get; set; } = DefaultParameter.PlayCount;
        }

        public string Name { get; set; } = DefaultParameter.Name;
        public string ArtistName { get; set; } = DefaultParameter.ArtistName;
        public string ImageName { get; set; } = DefaultParameter.ImageName;
        public Unit[] Units { get; set; } = new Unit[0];

        public Unit Basic => GetUnit(Difficulty.Basic);

        public Unit Advanced => GetUnit(Difficulty.Advanced);

        public Unit Expert => GetUnit(Difficulty.Expert);

        public Unit Master => GetUnit(Difficulty.Master);

        public Unit Ultima => GetUnit(Difficulty.Ultima);

        public Unit GetUnit(Difficulty difficulty) => Units?.FirstOrDefault(u => u.Difficulty == difficulty);
    }
}
