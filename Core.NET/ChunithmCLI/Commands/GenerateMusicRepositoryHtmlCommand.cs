using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector;
using ChunithmClientLibrary.Core;
using System.IO;
using System.Linq;
using System.Web;

namespace ChunithmCLI.Commands
{
    public class GenerateMusicRepositoryHtmlCommand : ICommand
    {
        public class ParameterContainer
        {
            public string DatabaseUrl { get; private set; }
            public string TemplateHtmlPath { get; private set; }
            public string DestinationPath { get; private set; }
            public string VersionName { get; private set; }

            public ParameterContainer(string[] args)
            {
                for (var i = 0; i < args.Length; i++)
                {
                    switch (args[i])
                    {
                        case "--host":
                        case "--db-url":
                            DatabaseUrl = args[i + 1];
                            break;
                        case "--src":
                            TemplateHtmlPath = args[i + 1];
                            break;
                        case "--dist":
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

        public string GetCommandName() => "gen-table-html";

        public bool Called(string[] args)
        {
            if (args == null && !args.Any())
            {
                return false;
            }

            return args[0] == GetCommandName();
        }

        public void Call(string[] args)
        {
            var param = new ParameterContainer(args);
            var repository = RequestMusicRepository(param);

            using (var writer = new StreamWriter(param.DestinationPath))
            {
                var source = GenerateSource(repository, param.TemplateHtmlPath);
                writer.Write(source);
            }
        }

        private IMusicRepository RequestMusicRepository(ParameterContainer param)
        {
            using var connector = new ChunithmMusicDatabaseHttpClientConnector(param.DatabaseUrl);
            return connector.GetMusicTableAsync().Result.Repository;
        }

        private string GenerateSource(IMusicRepository repository, string templatePath)
        {
            var source = ReadTemplate(templatePath);

            var tableTemplate = GetTemplate(source, "__TEMPLATE-TABLE__");
            var unitTemplate = GetTemplate(source, "__TEMPLATE-TABLE-ROW__");

            foreach (var group in repository.GetMusics().GroupBy(x => x.MasterMusic.Genre))
            {
                var tableBodyHtml = group.GroupBy(x => x.MasterMusic.Id)
                    .Select(x => x.ToDictionary(y => y.Difficulty, y => y))
                    .Select(x =>
                    {
                        var src = unitTemplate;
                        src = src.Replace("%music-name%", HttpUtility.HtmlEncode(x[Difficulty.Basic].MasterMusic.Name));
                        src = src.Replace("%base-rating-basic%", x[Difficulty.Basic].BaseRating.ToString("0.0"));
                        src = src.Replace("%base-rating-advanced%", x[Difficulty.Advanced].BaseRating.ToString("0.0"));
                        src = src.Replace("%base-rating-expert%", x[Difficulty.Expert].BaseRating.ToString("0.0"));
                        src = src.Replace("%base-rating-master%", x[Difficulty.Master].BaseRating.ToString("0.0"));

                        src = src.Replace("%unverified-basic%", !x[Difficulty.Basic].Verified ? "unverified" : "");
                        src = src.Replace("%unverified-advanced%", !x[Difficulty.Advanced].Verified ? "unverified" : "");
                        src = src.Replace("%unverified-expert%", !x[Difficulty.Expert].Verified ? "unverified" : "");
                        src = src.Replace("%unverified-master%", !x[Difficulty.Master].Verified ? "unverified" : "");

                        return src;
                    })
                    .Aggregate((acc, src) => acc + "\n" + src);

                var tableHtml = tableTemplate.Replace("%table-body%", tableBodyHtml);
                source = source.Replace($@"%table({group.Key})%", tableHtml);
            }

            return source;
        }

        private string ReadTemplate(string templatePath)
        {
            using (var reader = new StreamReader(templatePath))
            {
                return reader.ReadToEnd();
            }
        }

        private string GetTemplate(string source, string symbol)
        {
            var startWord = $"<!--{symbol}";
            var start = source.IndexOf(startWord);
            if (start < 0)
            {
                return "";
            }

            var endWord = "-->";
            var end = source.IndexOf(endWord, start);
            if (end < 0)
            {
                return "";
            }

            return source.Substring(start + startWord.Length, end - (start + startWord.Length)).Trim();
        }
    }
}
