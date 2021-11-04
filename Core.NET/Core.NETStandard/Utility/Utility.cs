using System.Globalization;
using System.IO;
using System.Text;

namespace ChunithmClientLibrary
{
    public static partial class Utility
    {
        static partial void Initialize();

        static Utility()
        {
            Initialize();
        }

        public static string LoadStringContent(string path)
        {
            return File.ReadAllText(path);
        }

        public static string LoadStringContent(string path, Encoding encoding)
        {
            return File.ReadAllText(path, encoding);
        }

        public static int ParseScore(string scoreText)
        {
            if (!int.TryParse(scoreText, NumberStyles.Number, null, out int score))
            {
                return DefaultParameter.Score;
            }
            return score;
        }

        public static double GetBorderBaseRating(string levelText)
        {
            decimal integer = 0;
            decimal @decimal = 0;

            if (levelText.Contains("+"))
            {
                @decimal = 0.5m;
            }

            levelText = levelText.Replace("+", "");
            if (!decimal.TryParse(levelText, out integer))
            {
                return DefaultParameter.BaseRating;
            }

            return (double)(integer + @decimal);
        }
    }
}
