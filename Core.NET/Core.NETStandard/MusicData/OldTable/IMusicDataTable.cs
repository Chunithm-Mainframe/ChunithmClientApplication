using ChunithmClientLibrary.Table;
using System;

namespace ChunithmClientLibrary.MusicData
{
    [Obsolete]
    public interface IMusicDataTable<TMusicDataTableUnit> : ITable<TMusicDataTableUnit>
        where TMusicDataTableUnit : IMusicDataTableUnit
    {
        TMusicDataTableUnit GetTableUnit(int id);
        TMusicDataTableUnit GetTableUnit(string name);
    }
}
