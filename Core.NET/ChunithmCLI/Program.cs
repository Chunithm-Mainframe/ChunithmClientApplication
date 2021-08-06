using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector;
using System;

namespace ChunithmCLI
{
    class Program
    {
        static void Main(string[] args)
        {
            var reader = new MusicDataTableJsonReader();
            var table = reader.Read(Utility.LoadStringContent("./table.json"));
            var dbUrl = "https://script.google.com/macros/s/AKfycbyvSk_-plhY_nx2764akClxjf38hMYjOmn9S0hWXtD3zZ4_PGSW5amPOhVZIecr-9w/exec";

            using (var databaseConnector = new ChunithmMusicDatabaseHttpClientConnector(dbUrl))
            {
                databaseConnector.UpdateTableAsync(table.MusicDatas).GetMusicDatabaseApiResult("sending table... ");

                Console.WriteLine("completed.");
            }

            return;

            var command = CommandFactroy.Get(args);
            if (command == null)
            {
                Console.WriteLine("Command not found");
                return;
            }

            Console.WriteLine($"Execute: {command.GetCommandName()}");
            command.Call(args);
            Console.WriteLine("Done");
        }
    }
}
