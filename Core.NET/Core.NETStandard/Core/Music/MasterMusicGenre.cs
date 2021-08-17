using System;

namespace ChunithmClientLibrary.Core
{
    [System.Obsolete]
    public class MasterMusicGenre : IMasterMusicGenre
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public MasterMusicGenre() { }

        public MasterMusicGenre(IMasterMusicGenre masterMusicGenre)
        {
            Set(masterMusicGenre);
        }

        public void Set(IMasterMusicGenre masterMusicGenre)
        {
            _ = masterMusicGenre ?? throw new ArgumentNullException(nameof(masterMusicGenre));

            Id = masterMusicGenre.Id;
            Name = masterMusicGenre.Name;
        }
    }
}
