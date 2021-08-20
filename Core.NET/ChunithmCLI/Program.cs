using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector;
using ChunithmClientLibrary.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;

namespace ChunithmCLI
{
    class Program
    {
        static void Main(string[] args)
        {
            if (SubMain(args))
            {
                return;
            }

            var command = CommandFactroy.Get(args);
            if (command == null)
            {
                Console.WriteLine("Command not found");
                return;
            }

            Console.WriteLine($"Execute: {command.GetCommandName()}");
            command.Call(args);
            Console.WriteLine("Done");
        }

        private static bool SubMain(string[] args)
        {
            var source = Utility.LoadStringContent("./new_table.json");
            var table = Utility.DeserializeFromJson<Table>(source);
            var repository = new MusicRepository();
            repository.Set(table.MasterMusics, table.MusicRatings);

            Console.WriteLine(repository.GetMasterMusics().Count);
            Console.WriteLine(repository.GetMusics().Count);

            using (var connector = new ChunithmMusicDatabaseHttpClientConnector("https://script.google.com/macros/s/AKfycbyvSk_-plhY_nx2764akClxjf38hMYjOmn9S0hWXtD3zZ4_PGSW5amPOhVZIecr-9w/exec"))
            {
                var musics = repository.GetMusics();
                var ret = connector.UpdateMusicTableAsync(musics).Result;
            }

            return true;
        }
    }

    [DataContract]
    class Table
    {
        [DataContract]
        public class MasterMusicUnit : IMasterMusic
        {
            [DataMember(Name = "id")] public int Id { get; set; }
            [DataMember(Name = "name")] public string Name { get; set; }
            [DataMember(Name = "genre")] public string Genre { get; set; }

            public MasterMusicUnit(IMasterMusic masterMusic)
            {
                Id = masterMusic.Id;
                Name = masterMusic.Name;
                Genre = masterMusic.Genre;
            }
        }

        [DataContract]
        public class MusicRatingUnit : IMusicRating
        {
            [DataMember(Name = "masterMusicId")] public int MasterMusicId { get; set; }
            [DataMember(Name = "difficulty")] public Difficulty Difficulty { get; set; }
            [DataMember(Name = "baseRating")] public double BaseRating { get; set; }
            [DataMember(Name = "verified")] public bool Verified { get; set; }

            public MusicRatingUnit(IMusic music)
            {
                MasterMusicId = music.MasterMusic.Id;
                Difficulty = music.Difficulty;
                BaseRating = music.BaseRating;
                Verified = music.Verified;
            }
        }

        [DataMember(Name = "masterMusics")]
        public List<MasterMusicUnit> MasterMusics { get; set; }

        [DataMember(Name = "musicRatings")]
        public List<MusicRatingUnit> MusicRatings { get; set; }

        public Table(IReadOnlyMusicRepository repository)
        {
            MasterMusics = repository.GetMasterMusics().Select(x => new MasterMusicUnit(x)).ToList();
            MusicRatings = repository.GetMusics().Select(x => new MusicRatingUnit(x))
                .OrderBy(x => MasterMusics.FindIndex(0, y => y.Id == x.MasterMusicId))
                .ThenBy(x => x.Difficulty)
                .ToList();
        }
    }
}
