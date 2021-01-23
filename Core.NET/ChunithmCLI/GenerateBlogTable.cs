using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector;
using ChunithmClientLibrary.Core;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace ChunithmCLI
{
    class GenerateBlogTable : ICommand
    {
        public class Argument
        {
            public string DataBaseUrl { get; private set; }
            public string VersionName { get; private set; }
            public string MaxLevelText { get; private set; }
            public string MinLevelText { get; private set; }
            public string DestinationPath { get; private set; }

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
                        case "--db-url":
                            DataBaseUrl = args[i + 1];
                            break;
                        case "--max-level":
                            MaxLevelText = args[i + 1];
                            break;
                        case "--min-level":
                            MinLevelText = args[i + 1];
                            break;
                        case "--dest":
                            DestinationPath = args[i + 1];
                            break;
                        case "--version":
                            VersionName = args[i + 1];
                            break;
                    }
                }
            }
        }

        private const string COMMAND_NAME = "gen-blog-table";

        public string GetCommandName()
        {
            return COMMAND_NAME;
        }

        public bool Called(string[] args)
        {
            return args?.FirstOrDefault() == COMMAND_NAME;
        }

        public void Call(string[] args)
        {
            var arg = new Argument(args);

            var musicDataTable = GetMusicDataTable(arg.DataBaseUrl);
            var (expert, master) = SplitMusicDataTable(musicDataTable);
            var minLevel = decimal.Parse(arg.MinLevelText);
            var maxLevel = decimal.Parse(arg.MaxLevelText);
            var tableText = GenerateTableText(minLevel, maxLevel, expert, master);

            if (Directory.Exists(Path.GetDirectoryName(arg.DestinationPath)))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(arg.DestinationPath));
            }

            using (var writer = new StreamWriter(arg.DestinationPath))
            {
                writer.Write(tableText);
            }
        }

        private static IMusicDataTable GetMusicDataTable(string url)
        {
            var connector = new ChunithmMusicDatabaseHttpClientConnector(url);
            return connector.GetTableAsync().Result.MusicDataTable;
        }

        private static string GenerateTableText(decimal minLevel, decimal maxLevel, IMusicData[] expert, IMusicData[] master)
        {
            var table = new Dictionary<string, List<string>>();
            for (var level = minLevel; level <= maxLevel; level += 0.1m)
            {
                table[level.ToString("#.0")] = new List<string>();
            }
            foreach (var unit in expert)
            {
                table[unit.BaseRating.ToString("#.0")].Add($"{unit.Name}(EXP)");
            }
            foreach (var unit in master)
            {
                table[unit.BaseRating.ToString("#.0")].Add(unit.Name);
            }

            var tableText = new StringBuilder();
            foreach (var (level, units) in table)
            {
                var musicNames = units.Any() ? units.Aggregate((src, acc) => $"{src} / {acc}") : "";
                tableText.AppendLine("<tr>");
                tableText.AppendLine($"    <td>{level}</td>");
                tableText.AppendLine($"    <td><p>{musicNames}</p></td>");
                tableText.AppendLine("</tr>");
            }
            return tableText.ToString();
        }

        private static (IMusicData[] expert, IMusicData[] master) SplitMusicDataTable(IMusicDataTable musicDataTable)
        {
            var expert = musicDataTable.MusicDatas
                .Where(m => m.Difficulty == Difficulty.Expert && m.Verified && m.BaseRating >= 11.0)
                .ToArray();
            var master = musicDataTable.MusicDatas
                .Where(m => m.Difficulty == Difficulty.Master && m.Verified)
                .ToArray();
            return (expert, master);
        }
    }
}
