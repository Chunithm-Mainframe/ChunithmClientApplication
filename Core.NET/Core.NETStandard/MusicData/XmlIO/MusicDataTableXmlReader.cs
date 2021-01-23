using ChunithmClientLibrary.Core;
using ChunithmClientLibrary.MusicData.XmlIO;
using ChunithmClientLibrary.Reader;
using ClosedXML.Excel;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace ChunithmClientLibrary
{
    public sealed class MusicDataTableXmlReader : IReader<IXLWorksheet, IMusicDataTable>
    {
        public IMusicDataTable Read(string workbookPath)
        {
            return Read(workbookPath, "MusicData");
        }

        public IMusicDataTable Read(string workbookPath, string sheetName)
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

            var sheet = workbook.Worksheet(sheetName);
            if (sheet == null)
            {
                throw new InvalidDataException();
            }

            return Read(sheet);
        }

        public IMusicDataTable Read(IXLWorksheet source)
        {
            var musicDataTable = new MusicDataTable();

            var header = new Header().GetColumnsMappedByParameter();
            var rows = source.Rows().Skip(1);
            foreach (var row in rows)
            {
                musicDataTable.Add(CreateMusicData(header, row));
            }

            return musicDataTable;
        }

        private Core.MusicData CreateMusicData(Dictionary<Header.Parameter, Header.Column> header, IXLRow row)
        {
            var musicData = new Core.MusicData();

            musicData.Id = row.Cell(header[Header.Parameter.Id].Index).GetValue<int>();
            musicData.Name = row.Cell(header[Header.Parameter.Name].Index).GetValue<string>();
            musicData.Genre = row.Cell(header[Header.Parameter.Genre].Index).GetValue<string>();
            musicData.Difficulty = Utility.ToDifficulty(row.Cell(header[Header.Parameter.Difficulty].Index).GetValue<string>());
            musicData.BaseRating = row.Cell(header[Header.Parameter.BaseRating].Index).GetValue<double>();
            musicData.Verified = row.Cell(header[Header.Parameter.Verified].Index).GetValue<bool>();

            return musicData;
        }
    }
}
