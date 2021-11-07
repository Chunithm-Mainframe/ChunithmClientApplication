using System;
using System.Linq;

namespace ChunithmClientLibrary.ChunithmNet.Data
{
    public class WorldsEndMusicDetail
    {
        public class Unit
        {
            public Difficulty Difficulty { get; set; } = DefaultParameter.Difficulty;
            public int Score { get; set; } = DefaultParameter.Score;

            public bool IsClear { get; set; } = DefaultParameter.IsClear;
            public ComboStatus ComboStatus { get; set; } = DefaultParameter.ComboStatus;
            public ChainStatus ChainStatus { get; set; } = DefaultParameter.ChainStatus;

            public int PlayCount { get; set; } = DefaultParameter.PlayCount;
        }

        public string Name { get; set; } = DefaultParameter.Name;
        public string ArtistName { get; set; } = DefaultParameter.ArtistName;
        public string ImageName { get; set; } = DefaultParameter.ImageName;
        public int WorldsEndLevel { get; set; } = DefaultParameter.WorldsEndLevel;
        public WorldsEndType WorldsEndType { get; set; } = DefaultParameter.WorldsEndType;

        public Unit[] Units { get; set; } = new Unit[0];

        public Unit WorldsEnd => GetUnit(Difficulty.WorldsEnd);

        public Unit GetUnit(Difficulty difficulty) => Units?.FirstOrDefault(u => u.Difficulty == difficulty);
    }
}
