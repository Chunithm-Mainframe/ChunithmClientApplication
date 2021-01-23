using ChunithmClientLibrary.Core;
using ChunithmClientLibrary.Writer;
using ClosedXML.Excel;
using System.Linq;
using Header = ChunithmClientLibrary.MusicData.XmlIO.Header;

namespace ChunithmClientLibrary
{
    public sealed class MusicDataTableXmlWriter : XmlWriter<IMusicDataTable>, IWriter<IMusicDataTable>
    {
        public override XLWorkbook CreateWorkbook(IMusicDataTable table)
        {
            var workbook = new XLWorkbook();

            ApplyRecord(workbook.AddWorksheet("MusicData"), table);



            return workbook;
        }

        private void ApplyRecord(IXLWorksheet worksheet, IMusicDataTable table)
        {
            if (worksheet == null || table == null)
            {
                return;
            }

            var header = new Header().GetColumnsMappedByParameter();

            worksheet.Cell(1, header[Header.Parameter.Index].Index).Value = header[Header.Parameter.Index].Text;
            worksheet.Cell(1, header[Header.Parameter.Id].Index).Value = header[Header.Parameter.Id].Text;
            worksheet.Cell(1, header[Header.Parameter.Name].Index).Value = header[Header.Parameter.Name].Text;
            worksheet.Cell(1, header[Header.Parameter.Genre].Index).Value = header[Header.Parameter.Genre].Text;
            worksheet.Cell(1, header[Header.Parameter.Difficulty].Index).Value = header[Header.Parameter.Difficulty].Text;
            worksheet.Cell(1, header[Header.Parameter.BaseRating].Index).Value = header[Header.Parameter.BaseRating].Text;
            worksheet.Cell(1, header[Header.Parameter.Verified].Index).Value = header[Header.Parameter.Verified].Text;

            var musicDatas = table.MusicDatas.ToList();
            for (var i = 0; i < musicDatas.Count; i++)
            {
                var row = i + 2;
                var musicData = musicDatas[i];
                worksheet.Cell(row, header[Header.Parameter.Index].Index).Value = i + 1;
                worksheet.Cell(row, header[Header.Parameter.Id].Index).Value = musicData.Id;
                worksheet.Cell(row, header[Header.Parameter.Name].Index).Value = musicData.Name;
                worksheet.Cell(row, header[Header.Parameter.Name].Index).DataType = XLDataType.Text;
                worksheet.Cell(row, header[Header.Parameter.Genre].Index).Value = musicData.Genre;
                worksheet.Cell(row, header[Header.Parameter.Difficulty].Index).Value = Utility.ToDifficultyText(musicData.Difficulty);
                worksheet.Cell(row, header[Header.Parameter.BaseRating].Index).Value = musicData.BaseRating;
                worksheet.Cell(row, header[Header.Parameter.Verified].Index).Value = musicData.Verified;
            }
        }
    }
}
