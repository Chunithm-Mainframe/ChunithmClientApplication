using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector;
using ChunithmClientLibrary.ChunithmNet.HttpClientConnector;
using ChunithmClientLibrary.Core;
using System;
using System.Linq;

namespace ChunithmCLI
{
    class UpdateMusicDataTable : ICommand
    {
        public class Argument
        {
            public string SegaId { get; private set; }
            public string Password { get; private set; }
            public int AimeIndex { get; private set; }
            public int MaxLevelValue { get; private set; }
            public string DataBaseUrl { get; private set; }
            public string VersionName { get; private set; }

            public Argument(string[] args)
            {
                for (var i = 0; i < args.Length; i++)
                {
                    if (!args[i].StartsWith("--"))
                    {
                        continue;
                    }

                    switch (args[i])
                    {
                        case "--sega-id":
                            SegaId = args[i + 1];
                            break;
                        case "--password":
                            Password = args[i + 1];
                            break;
                        case "--aime-index":
                            AimeIndex = int.Parse(args[i + 1]);
                            break;
                        case "--user-info":
                            SetUserInfo(args[i + 1]);
                            break;
                        case "--db-url":
                            DataBaseUrl = args[i + 1];
                            break;
                        case "--max-level":
                            MaxLevelValue = int.Parse(args[i + 1]);
                            break;
                        case "--version":
                            VersionName = args[i + 1];
                            break;
                    }
                }
            }

            private void SetUserInfo(string path)
            {
                var source = Utility.LoadStringContent(path);
                var userInfo = Utility.DeserializeFromJson<UserInfo>(source);
                SegaId = userInfo.SegaId;
                Password = userInfo.Password;
                AimeIndex = userInfo.AimeIndex;
            }
        }

        private const string COMMAND_NAME = "update-musicdata-table";
        private const int GENRE_CODE_ALL = 99;

        public string GetCommandName() => COMMAND_NAME;

        public bool Called(string[] args)
        {
            return args?.FirstOrDefault() == COMMAND_NAME;
        }

        public void Call(string[] args)
        {
            var arg = new Argument(args);

            var musicDataTable = new MusicDataTable();
            using (var connector = new ChunithmNetHttpClientConnector())
            using (var databaseConnector = new ChunithmMusicDatabaseHttpClientConnector(arg.DataBaseUrl))
            {
                var currentTable = databaseConnector.GetTableAsync().GetMusicDatabaseApiResult("get current table... ");

                connector.LoginAsync(arg.SegaId, arg.Password).GetNetApiResult("login... ");
                connector.SelectAimeAsync(arg.AimeIndex).GetNetApiResult("selecting aime... ");

                var musicGenre = connector.GetMusicGenreAsync(GENRE_CODE_ALL, Difficulty.Master).GetNetApiResult("downloading music list... ");
                musicDataTable.AddRange(musicGenre.MusicGenre);

                if (currentTable.MusicDataTable.MusicDatas.Count() == musicDataTable.MusicDatas.Count())
                {
                    Console.WriteLine("skip update.");
                    return;
                }

                for (var i = 0; i < arg.MaxLevelValue; i++)
                {
                    var musicLevel = connector.GetMusicLevelAsync(i).GetNetApiResult($"downloading level info ({i + 1}/{arg.MaxLevelValue})", false);
                    musicDataTable.AddRange(musicLevel.MusicLevel);
                }

                databaseConnector.UpdateTableAsync(musicDataTable.MusicDatas).GetMusicDatabaseApiResult("sending table... ");

                Console.WriteLine("completed.");
            }
        }
    }
}
