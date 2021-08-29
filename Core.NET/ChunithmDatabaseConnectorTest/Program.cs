using ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector;
using System;

namespace ChunithmDatabaseConnectorTest
{
    class Program
    {
        static void Main(string[] args)
        {
            using var connector = new ChunithmMusicDatabaseHttpClientConnector("https://script.google.com/macros/s/AKfycbyvSk_-plhY_nx2764akClxjf38hMYjOmn9S0hWXtD3zZ4_PGSW5amPOhVZIecr-9w/exec");
            var result = connector.GetPlayerRatingTableAsync().Result;

            foreach (var rec in result.Table.Records)
            {
                Console.WriteLine($"{rec.Id},{rec.BestRatings.Count},{rec.OutsideBestRatings.Count},{rec.RecentRatings.Count}");
            }
        }
    }
}
