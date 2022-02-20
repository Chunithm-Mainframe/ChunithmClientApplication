using ChunithmClientLibrary.HighScoreRecord;
using ChunithmClientLibrary.PlayerRecord.XmlIO;
using ChunithmClientLibrary.Reader;
using ClosedXML.Excel;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace ChunithmClientLibrary.PlayerRecord
{
    public sealed class PlayerRecordContainerXmlReader : IReader<IXLWorksheets, IPlayerRecordContainer>
    {
        public IPlayerRecordContainer Read(string workbookPath)
        {
            if (!File.Exists(workbookPath))
            {
                throw new FileNotFoundException();
            }

            var workbook = new XLWorkbook(workbookPath);
            if (workbook == null)
            {
                throw new InvalidDataException();
            }

            return Read(workbook.Worksheets);
        }

        public IPlayerRecordContainer Read(IXLWorksheets source)
        {
            var basicSheet = source.Worksheet("Basic");
            var advancedSheet = source.Worksheet("Advanced");
            var expertSheet = source.Worksheet("Expert");
            var masterSheet = source.Worksheet("Master");
            var ultimaSheet = source.Worksheet("Ultima");

            var playerRecordContainer = new PlayerRecordContainer();
            playerRecordContainer.SetTable(Read(basicSheet), Difficulty.Basic);
            playerRecordContainer.SetTable(Read(advancedSheet), Difficulty.Advanced);
            playerRecordContainer.SetTable(Read(expertSheet), Difficulty.Expert);
            playerRecordContainer.SetTable(Read(masterSheet), Difficulty.Master);
            playerRecordContainer.SetTable(Read(ultimaSheet), Difficulty.Ultima);

            return playerRecordContainer;
        }

        private IHighScoreRecordTable<IHighScoreRecordTableUnit> Read(IXLWorksheet source)
        {
            var highScoreRecordTable = new HighScoreRecordTable();

            var header = new Header().GetColumnsMappedByParameter();
            var rows = source.Rows().Skip(1);
            foreach (var row in rows)
            {
                highScoreRecordTable.Add(CreateHighScoreRecord(header, row));
            }

            return highScoreRecordTable;
        }

        private HighScoreRecordTableUnit CreateHighScoreRecord(Dictionary<Header.Parameter, Header.Column> header, IXLRow row)
        {
            var highScoreRecord = new HighScoreRecordTableUnit();

            highScoreRecord.Id = row.Cell(header[Header.Parameter.Id].Index).GetValue<int>();
            highScoreRecord.Name = row.Cell(header[Header.Parameter.Name].Index).GetValue<string>();
            highScoreRecord.Genre = row.Cell(header[Header.Parameter.Genre].Index).GetValue<string>();
            highScoreRecord.Difficulty = Utility.ToDifficulty(row.Cell(header[Header.Parameter.Difficulty].Index).GetValue<string>());
            highScoreRecord.Score = row.Cell(header[Header.Parameter.Score].Index).GetValue<int>();
            highScoreRecord.BaseRating = row.Cell(header[Header.Parameter.BaseRating].Index).GetValue<double>();
            highScoreRecord.Rating = row.Cell(header[Header.Parameter.Rating].Index).GetValue<double>();

            return highScoreRecord;
        }
    }
}
