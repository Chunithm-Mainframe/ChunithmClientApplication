using System;

namespace ChunithmCLI
{
    class Program
    {
        static void Main(string[] args)
        {
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
