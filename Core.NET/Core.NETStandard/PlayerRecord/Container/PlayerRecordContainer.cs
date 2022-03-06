using ChunithmClientLibrary.HighScoreRecord;
using System;
using System.Runtime.Serialization;

namespace ChunithmClientLibrary.PlayerRecord
{
    [DataContract]
    public sealed class PlayerRecordContainer : IPlayerRecordContainer
    {
        [DataMember]
        public HighScoreRecordTable Basic { get; set; } = new HighScoreRecordTable();
        [DataMember]
        public HighScoreRecordTable Advanced { get; set; } = new HighScoreRecordTable();
        [DataMember]
        public HighScoreRecordTable Expert { get; set; } = new HighScoreRecordTable();
        [DataMember]
        public HighScoreRecordTable Master { get; set; } = new HighScoreRecordTable();
        [DataMember]
        public HighScoreRecordTable Ultima { get; set; } = new HighScoreRecordTable();

        IHighScoreRecordTable<IHighScoreRecordTableUnit> IPlayerRecordContainer.Basic
        {
            get { return Basic; }
        }

        IHighScoreRecordTable<IHighScoreRecordTableUnit> IPlayerRecordContainer.Advanced
        {
            get { return Advanced; }
        }

        IHighScoreRecordTable<IHighScoreRecordTableUnit> IPlayerRecordContainer.Expert
        {
            get { return Expert; }
        }

        IHighScoreRecordTable<IHighScoreRecordTableUnit> IPlayerRecordContainer.Master
        {
            get { return Master; }
        }

        IHighScoreRecordTable<IHighScoreRecordTableUnit> IPlayerRecordContainer.Ultima
        {
            get { return Ultima; }
        }

        public PlayerRecordContainer() { }

        public PlayerRecordContainer(IPlayerRecordContainer table)
        {
            Set(table);
        }

        public void Set(IPlayerRecordContainer table)
        {
            if (table == null)
            {
                throw new ArgumentNullException(nameof(table));
            }

            SetTable(table.GetTable(Difficulty.Basic), Difficulty.Basic);
            SetTable(table.GetTable(Difficulty.Advanced), Difficulty.Advanced);
            SetTable(table.GetTable(Difficulty.Expert), Difficulty.Expert);
            SetTable(table.GetTable(Difficulty.Master), Difficulty.Master);
            SetTable(table.GetTable(Difficulty.Ultima), Difficulty.Ultima);
        }

        public IHighScoreRecordTable<IHighScoreRecordTableUnit> GetTable(Difficulty difficulty)
        {
            switch (difficulty)
            {
                case Difficulty.Basic:
                    return Basic;
                case Difficulty.Advanced:
                    return Advanced;
                case Difficulty.Expert:
                    return Expert;
                case Difficulty.Master:
                    return Master;
                case Difficulty.Ultima:
                    return Ultima;
            }

            return null;
        }

        public void SetTable(IHighScoreRecordTable<IHighScoreRecordTableUnit> record, Difficulty difficulty)
        {
            if (record == null)
            {
                throw new ArgumentNullException(nameof(record));
            }

            switch (difficulty)
            {
                case Difficulty.Basic:
                    Basic = new HighScoreRecordTable(record);
                    break;
                case Difficulty.Advanced:
                    Advanced = new HighScoreRecordTable(record);
                    break;
                case Difficulty.Expert:
                    Expert = new HighScoreRecordTable(record);
                    break;
                case Difficulty.Master:
                    Master = new HighScoreRecordTable(record);
                    break;
                case Difficulty.Ultima:
                    Ultima = new HighScoreRecordTable(record);
                    break;
            }
        }
    }
}
