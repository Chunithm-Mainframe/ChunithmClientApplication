using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector;
using System;
using System.Collections.Generic;

namespace ChunithmDatabaseConnectorTest
{
    class Program
    {
        static void Main(string[] args)
        {
            using var connector = new ChunithmMusicDatabaseHttpClientConnector("https://script.google.com/macros/s/AKfycbyvSk_-plhY_nx2764akClxjf38hMYjOmn9S0hWXtD3zZ4_PGSW5amPOhVZIecr-9w/exec");

            var result = connector
                .UpdateMusicAsync(new List<(int id, Difficulty difficulty, double baseRating)>
                {
                    (9999, Difficulty.Expert, 12.6),
                    (9998, Difficulty.Master, 13.8),
                })
                .Result;

            foreach (var rec in result.UpdatedMusics)
            {
                Console.WriteLine($"{rec.id},{rec.difficulty},{rec.baseRating}");
            }
        }
    }
}
