using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmNet.HttpClientConnector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ChunithmCLI.Commands
{
    public class GenreGetCommand : ICommand
    {
        public class Argument
        {
            public string SegaId { get; private set; }
            public string Password { get; private set; }
            public int AimeIndex { get; private set; }

            public Argument(string[] args)
            {
                for (var i = 0; i < args.Length; i++)
                {
                    switch (args[i])
                    {
                        case "--sega-id":
                            SegaId = args[i + 1];
                            i++;
                            break;
                        case "--password":
                            Password = args[i + 1];
                            i++;
                            break;
                        case "--aime-index":
                            AimeIndex = int.Parse(args[i + 1]);
                            i++;
                            break;
                    }
                }
            }
        }

        private const string COMMAND_NAME = "genre-get";

        public string GetCommandName()
        {
            return COMMAND_NAME;
        }

        public bool Called(string[] args)
        {
            if (args == null && !args.Any())
            {
                return false;
            }

            return args[0] == COMMAND_NAME;
        }

        public void Call(string[] args)
        {
            var arg = new Argument(args);

            var genres = new List<string>();
            using (var connector = new ChunithmNetHttpClientConnector())
            {
                connector.LoginAsync(arg.SegaId, arg.Password).Wait();
                var selectAime = connector.SelectAimeAsync(arg.AimeIndex);
                if (!selectAime.Result.Success)
                {
                    throw new Exception("Failed to login.");
                }

                var musicGenre = connector.GetMusicGenreAsync(Utility.GENRE_ALL_CODE, Difficulty.Master).Result;
                foreach (var unit in musicGenre.MusicGenre.Units)
                {
                    if (!genres.Contains(unit.Genre))
                    {
                        genres.Add(unit.Genre);
                    }
                }
            }

            var genreListText = new StringBuilder();
            genreListText.Append("[");
            for (var i = 0; i < genres.Count; i++)
            {
                if (i > 0)
                {
                    genreListText.Append(',');
                }
                genreListText.Append('"');
                genreListText.Append(genres[i]);
                genreListText.Append('"');
            }
            genreListText.Append("]");
            Console.WriteLine(genreListText.ToString());
        }
    }
}
