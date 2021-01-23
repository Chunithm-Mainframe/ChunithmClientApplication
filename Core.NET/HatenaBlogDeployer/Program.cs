using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector;
using ChunithmClientLibrary.Core;
using ChunithmClientLibrary.MusicData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Xml.Linq;

namespace HatenaBlogDeployer
{
    class ProgramArgs
    {
        public string DataBaseUrl { get; private set; }
        public string Version { get; private set; }
        public string HatenaId { get; private set; }
        public string BlogId { get; private set; }
        public string ApiToken { get; private set; }
        public string EntryId { get; private set; }
        public string MaxLevelText { get; private set; }
        public string MinLevelText { get; private set; }

        public ProgramArgs(string[] args)
        {
            Version = "";
            MinLevelText = "10.0";
            MaxLevelText = "14.2";

            for (var i = 0; i < args.Length; i++)
            {
                if (!args[i].StartsWith("--"))
                {
                    continue;
                }

                switch (args[i])
                {
                    case "--db_url":
                        DataBaseUrl = args[i + 1];
                        i += 1;
                        break;
                    case "--hatena_id":
                        HatenaId = args[i + 1];
                        i += 1;
                        break;
                    case "--blog_id":
                        BlogId = args[i + 1];
                        break;
                    case "--api_token":
                        ApiToken = args[i + 1];
                        break;
                    case "--entry_id":
                        EntryId = args[i + 1];
                        break;
                    case "--max_level":
                        MaxLevelText = args[i + 1];
                        break;
                    case "--min_level":
                        MinLevelText = args[i + 1];
                        break;
                }
            }
        }
    }

    class DeployArgs
    {
        public string HatenaId { get; private set; }
        public string BlogId { get; private set; }
        public string ApiToken { get; private set; }
        public string EntryId { get; private set; }

        public string BasicAuth { get; private set; }
        public string RequestUrl { get; private set; }

        public DeployArgs(ProgramArgs args)
            : this(args.HatenaId, args.BlogId, args.ApiToken, args.EntryId)
        {
        }

        public DeployArgs(string hatenaId, string blogId, string apiToken, string entryId)
        {
            HatenaId = hatenaId;
            BlogId = blogId;
            ApiToken = apiToken;
            EntryId = entryId;
            BasicAuth = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{hatenaId}:{apiToken}"));
            RequestUrl = $"https://blog.hatena.ne.jp/{HatenaId}/{BlogId}/atom/entry/{EntryId}";
        }

        public HttpRequestMessage CreateRequestMessage(HttpMethod method)
        {
            var request = new HttpRequestMessage();
            request.Method = method;
            request.RequestUri = new Uri(RequestUrl);
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", BasicAuth);
            return request;
        }
    }

    class GetMusicDataTableArgs
    {
        public string Url { get; private set; }
        public string Version { get; private set; }

        public GetMusicDataTableArgs(ProgramArgs args)
            : this(args.DataBaseUrl, args.Version)
        {
        }

        public GetMusicDataTableArgs(string url, string version = "")
        {
            Url = url;
            Version = version;
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            var programArgs = new ProgramArgs(args);

            var getTableArgs = new GetMusicDataTableArgs(programArgs.DataBaseUrl);
            var musicDataTable = GetMusicDataTable(getTableArgs);
            Console.WriteLine("Success get music data table.");
            Console.WriteLine("Music count: {0}", musicDataTable.MusicDatas?.Count());

            var deployArgs = new DeployArgs(
                hatenaId: programArgs.HatenaId,
                blogId: programArgs.BlogId,
                apiToken: programArgs.ApiToken,
                entryId: programArgs.EntryId);
            Deploy(deployArgs, musicDataTable, programArgs.MinLevelText, programArgs.MaxLevelText);
        }

        private static IMusicDataTable GetMusicDataTable(GetMusicDataTableArgs args)
        {
            var connector = new ChunithmMusicDatabaseHttpClientConnector(args.Url);
            return connector.GetTableAsync().Result.MusicDataTable;
        }

        private static void Deploy(DeployArgs args, IMusicDataTable musicDataTable, string minLevelText, string maxLevelText, string currentHash = "")
        {
            var client = new HttpClient();
            var getCurrent = args.CreateRequestMessage(HttpMethod.Get);
            var getCurrentResult = client.SendAsync(getCurrent).Result;
            var currentSource = Encoding.UTF8.GetString(getCurrentResult.Content.ReadAsByteArrayAsync().Result);
            var currentDocument = XDocument.Parse(currentSource);
            XNamespace ns = "http://www.w3.org/2005/Atom";
            var title = currentDocument.Element(ns + "entry").Element(ns + "title").Value;
            var currentContent = currentDocument.Element(ns + "entry").Element(ns + "content").Value;

            var beginToken = "<!--GEN_BY_REPORT_TOOL_BEGIN-->";
            var endToken = "<!--GEN_BY_REPORT_TOOL_END-->";
            var beginIndex = currentContent.IndexOf(beginToken);
            var endIndex = currentContent.IndexOf(endToken);
            if (beginIndex == -1 || endIndex == -1)
            {
                throw new Exception("Not find token.");
            }

            var (hash, expert, master) = GetTableHash(musicDataTable);
            if (currentHash == hash)
            {
                Console.WriteLine("Skipping deploy.");
                return;
            }
            var minLevel = decimal.Parse(minLevelText);
            var maxLevel = decimal.Parse(maxLevelText);
            var nextTable = GenerateTableText(minLevel, maxLevel, expert, master);

            var nextContent = currentContent.Remove(beginIndex + beginToken.Length, endIndex - (beginIndex + beginToken.Length));
            nextContent = nextContent.Insert(beginIndex + beginToken.Length, nextTable);

            var nextSource = $@"
<entry xmlns=""http://www.w3.org/2005/Atom""
       xmlns:app=""http://www.w3.org/2007/app"">
  <title>{title}</title>
  <author><name>name</name></author>
  <content type=""text/html"">
{HttpUtility.HtmlEncode(nextContent.ToString())}
  </content>
  <category term=""CHUNITHM"" />
  <app:control>
    <app:draft>no</app:draft>
  </app:control>
</entry>
";
            Console.WriteLine(nextSource);
            var putRequest = args.CreateRequestMessage(HttpMethod.Put);
            putRequest.Content = new StringContent(nextSource);
            var putRequestResult = client.SendAsync(putRequest).Result;
            Console.WriteLine(putRequestResult.Content.ReadAsStringAsync().Result);
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
                tableText.AppendLine($"<td>{level}</td>");
                tableText.AppendLine($"<td><p>{musicNames}</p></td>");
                tableText.AppendLine("</tr>");
            }
            return tableText.ToString();
        }

        private static (string hash, IMusicData[] expert, IMusicData[] master) GetTableHash(IMusicDataTable musicDataTable)
        {
            var expert = musicDataTable.MusicDatas
                .Where(m => m.Difficulty == Difficulty.Expert && m.Verified && m.BaseRating >= 11.0)
                .ToArray();
            var master = musicDataTable.MusicDatas
                .Where(m => m.Difficulty == Difficulty.Master && m.Verified)
                .ToArray();

            var hashOrigin = new StringBuilder();
            foreach (var unit in expert)
            {
                hashOrigin.Append(unit.Name).Append("EXP");
            }
            foreach (var unit in master)
            {
                hashOrigin.Append(unit.Name);
            }

            var hash = new StringBuilder();
            foreach (var @byte in MD5.Create().ComputeHash(Encoding.UTF8.GetBytes(hashOrigin.ToString())))
            {
                hash.Append(@byte.ToString("x2"));
            }
            return (hash.ToString(), expert, master);
        }
    }
}
