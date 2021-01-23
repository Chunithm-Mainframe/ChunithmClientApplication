using ChunithmClientLibrary.Core;
using ChunithmClientLibrary.Writer;

namespace ChunithmClientLibrary
{
    public sealed class MusicDataTableJsonWriter : JsonWriter<IMusicDataTable, MusicDataTable>, IWriter<IMusicDataTable>
    {
        public override MusicDataTable CreateJsonData(IMusicDataTable source)
        {
            var musicDataTable = new MusicDataTable();
            musicDataTable.AddRange(source.MusicDatas);
            return musicDataTable;
        }
    }
}
