using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmNet.API;
using ChunithmClientLibrary.ChunithmNet.HttpClientConnector;
using System;
using System.Diagnostics;
using System.Net.Http;

namespace ChunithmNetConnetorTest
{
    partial class Program
    {
        static HttpClient client = new();
        static ChunithmNetHttpClientConnector connector;

        static void Main(string[] args)
        {
            Test_Login(args[0], args[1]);

            Test_MusicLevel();
            Test_MusicGenre();
            Test_MusicDetail();
            Test_Playlog();
            Test_PlaylogDetail();
            Test_WorldsEndMusic();
            Test_WorldsEndMusicDetail();
        }


        private static void Test_Login(string segaId, string password)
        {
            connector = new ChunithmNetHttpClientConnector();
            Login(segaId, password);
            Console.ReadLine();

            Console.Write("Select Aime (int) --> ");
            if (!int.TryParse(Console.ReadLine(), out int index))
            {
                Console.WriteLine("Warning!! Invalid input data");
            }
            AimeSelect(index);
            Console.ReadLine();
        }

        [Conditional("MUSIC_LEVEL")]
        private static void Test_MusicLevel()
        {
            Console.Write("Select music level (int) --> ");
            if (!int.TryParse(Console.ReadLine(), out int musicLevel))
            {
                Console.WriteLine("Warning!! Invalid input data");
            }
            MusicLevel(musicLevel);
            Console.ReadLine();
        }

        [Conditional("MUSIC_GENRE")]
        private static void Test_MusicGenre()
        {
            Console.Write("Select genre (int) --> ");
            if (!int.TryParse(Console.ReadLine(), out int genreCode))
            {
                Console.WriteLine("Warning!! Invalid input data");
            }

            Console.Write("Select difficulty (int) --> ");
            if (!int.TryParse(Console.ReadLine(), out int difficultyIndex))
            {
                Console.WriteLine("Warning!! Invalid input data");
            }

            var difficulty = (Difficulty)difficultyIndex;
            MusicGenre(genreCode, difficulty);
            Console.ReadLine();
        }

        [Conditional("MUSIC_DETAIL")]
        private static void Test_MusicDetail()
        {
            Console.Write("Select music (int) --> ");
            if (!int.TryParse(Console.ReadLine(), out int id))
            {
                Console.WriteLine("Warning!! Invalid input data");
            }

            MusicDetail(id);
            Console.ReadLine();
        }
        
        [Conditional("PLAY_LOG")]
        private static void Test_Playlog()
        {
            Playlog();
            Console.ReadLine();
        }

        [Conditional("PLAYLOG_DETAIL")]
        private static void Test_PlaylogDetail()
        {
            Console.Write("Select playlog index (int) --> ");
            if (!int.TryParse(Console.ReadLine(), out int index))
            {
                Console.WriteLine("Warning!! Invalid input data");
            }

            PlaylogDetail(index);
            Console.ReadLine();
        }

        [Conditional("WORLDS_END_MUSIC")]
        private static void Test_WorldsEndMusic()
        {
            WorldsEndMusic();
            Console.ReadLine();
        }

        [Conditional("WORLDS_END_MUSIC_DETAIL")]
        private static void Test_WorldsEndMusicDetail()
        {
            Console.Write("Select music (int) --> ");
            if (!int.TryParse(Console.ReadLine(), out int id))
            {
                Console.WriteLine("Warning!! Invalid input data");
            }

            WorldsEndMusicDetail(id);
            Console.ReadLine();
        }

        private static void ShowCommonErrorMessage(IChunithmNetApiResponse errorInfo)
        {
            Console.WriteLine(" Failed");
            Console.WriteLine($" Error Code: {errorInfo.ErrorCode}");
            Console.WriteLine($" Error Message: {errorInfo.ErrorMessage}");
        }
    }
}
