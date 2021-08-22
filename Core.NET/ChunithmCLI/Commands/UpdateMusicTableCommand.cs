using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.ChunithmNet.HttpClientConnector;
using ChunithmClientLibrary.Core;
using System;
using System.Collections.Generic;

namespace ChunithmCLI.Commands
{
    public class UpdateMusicTableCommand : ICommand
    {
        public class ParameterContainer
        {
            public string SegaId { get; private set; }
            public string Password { get; private set; }
            public int AimeIndex { get; private set; }
            public int MaxLevelValue { get; private set; }
            public string DataBaseUrl { get; private set; }
            public string VersionName { get; private set; }

            public ParameterContainer(string[] args)
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

        private const int GENRE_CODE_ALL = 99;

        public string GetCommandName() => "update-music-table";

        public void Call(string[] args)
        {
            var parameters = new ParameterContainer(args);

            using (var connector = new ChunithmNetHttpClientConnector())
            using (var databaseConnector = new ChunithmMusicDatabaseHttpClientConnector(parameters.DataBaseUrl))
            {
                var currentRepository = databaseConnector.GetMusicTableAsync()
                    .GetMusicDatabaseApiResult("get current table... ")
                    .Repository;

                connector.LoginAsync(parameters.SegaId, parameters.Password).GetNetApiResult("login... ");
                connector.SelectAimeAsync(parameters.AimeIndex).GetNetApiResult("selecting aime... ");

                var musicGenre = connector.GetMusicGenreAsync(GENRE_CODE_ALL, Difficulty.Master)
                    .GetNetApiResult($"downloading music list...")
                    .MusicGenre;

                if (currentRepository.GetMasterMusics().Count == musicGenre.Units.Length)
                {
                    Console.WriteLine("skip update.");
                    return;
                }

                var musicLevels = new List<MusicLevel>();
                for (var i = 0; i < parameters.MaxLevelValue; i++)
                {
                    var musicLevel = connector.GetMusicLevelAsync(i)
                        .GetNetApiResult($"downloading level info ({i + 1}/{parameters.MaxLevelValue})", false)
                        .MusicLevel;
                    musicLevels.Add(musicLevel);
                }

                var newRepository = new MusicRepository(musicGenre, musicLevels);
                var result = databaseConnector.UpdateMusicTableAsync(newRepository.GetMusics())
                    .GetMusicDatabaseApiResult("sending table... ");

                Console.WriteLine("completed.");
            }
        }
    }
}
