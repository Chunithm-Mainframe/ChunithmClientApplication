using System.IO;

namespace ChunithmClientLibrary.ChunithmNet
{
    public static class ChunithmNetUrl
    {
        public const string Root = "https://new.chunithm-net.com/chuni-mobile/html/mobile/";

        public static string CreateUrl(string localPath)
        {
            return Path.Combine(Root, localPath);
        }
    }
}
