using ChunithmClientLibrary.Table;

namespace ChunithmClientLibrary.MusicData
{
    public interface IMusicDataTable<TMusicDataTableUnit> : ITable<TMusicDataTableUnit>
        where TMusicDataTableUnit : IMusicDataTableUnit
    {
        TMusicDataTableUnit GetTableUnit(int id);
        TMusicDataTableUnit GetTableUnit(string name);
    }
}
