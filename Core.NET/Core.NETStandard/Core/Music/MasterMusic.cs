using System;

namespace ChunithmClientLibrary.Core
{
    public class MasterMusic : IMasterMusic
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Genre { get; set; }

        public MasterMusic() { }

        public MasterMusic(IMasterMusic masterMusic)
        {
            Set(masterMusic);
        }

        public void Set(IMasterMusic masterMusic)
        {
            _ = masterMusic ?? throw new ArgumentNullException(nameof(masterMusic));

            Id = masterMusic.Id;
            Name = masterMusic.Name;
            Genre = masterMusic.Genre;
        }
    }
}
