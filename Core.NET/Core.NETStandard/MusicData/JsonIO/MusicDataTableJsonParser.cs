using ChunithmClientLibrary.Core;
using ChunithmClientLibrary.Reader;

namespace ChunithmClientLibrary
{
    public sealed class MusicDataTableJsonReader : JsonReader<IMusicDataTable>, IReader<string, IMusicDataTable>
    {
        public override IMusicDataTable Read(string json)
        {
            return Utility.DeserializeFromJson<MusicDataTable>(json);
        }
    }
}
