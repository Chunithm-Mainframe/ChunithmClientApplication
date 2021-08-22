using ChunithmClientLibrary.ChunithmNet.Data;
using System;

namespace ChunithmClientLibrary.Core
{
    public class MasterMusic : IMasterMusic
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Genre { get; set; }

        public MasterMusic() { }

        public MasterMusic(int id, string name, string genre)
        {
            Set(id, name, genre);
        }

        public MasterMusic(MusicGenre.Unit unit)
        {
            _ = unit ?? throw new ArgumentNullException(nameof(unit));

            Set(unit.Id, unit.Name, unit.Genre);
        }

        public MasterMusic(IMasterMusic masterMusic)
        {
            Set(masterMusic);
        }

        public void Set(IMasterMusic masterMusic)
        {
            _ = masterMusic ?? throw new ArgumentNullException(nameof(masterMusic));

            Set(masterMusic.Id, masterMusic.Name, masterMusic.Genre);
        }

        public void Set(int id, string name, string genre)
        {
            Id = id;
            Name = name;
            Genre = genre;
        }
    }
}
