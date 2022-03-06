using ChunithmClientLibrary.HighScoreRecord;

namespace ChunithmClientLibrary.PlayerRecord
{
    public interface IPlayerRecordContainer
    {
        IHighScoreRecordTable<IHighScoreRecordTableUnit> Basic { get; }
        IHighScoreRecordTable<IHighScoreRecordTableUnit> Advanced { get; }
        IHighScoreRecordTable<IHighScoreRecordTableUnit> Expert { get; }
        IHighScoreRecordTable<IHighScoreRecordTableUnit> Master { get; }
        IHighScoreRecordTable<IHighScoreRecordTableUnit> Ultima { get; }

        // IHighScoreRecordTable<IWorldsEndHighScoreRecordTableUnit> WorldsEnd { get; }

        IHighScoreRecordTable<IHighScoreRecordTableUnit> GetTable(Difficulty difficulty);
        void SetTable(IHighScoreRecordTable<IHighScoreRecordTableUnit> table, Difficulty difficulty);

        // IHighScoreRecordTable<IWorldsEndHighScoreRecordTableUnit> GetWorldsEndTable();
        // void SetWorldsEndTable(IHighScoreRecordTable<IWorldsEndHighScoreRecordTableUnit> table);
    }
}
