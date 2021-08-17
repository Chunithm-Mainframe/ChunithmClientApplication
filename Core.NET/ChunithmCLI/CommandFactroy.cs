using ChunithmCLI.Commands;
using System.Collections.Generic;
using System.Linq;

namespace ChunithmCLI
{
    public static class CommandFactroy
    {
        private static List<ICommand> commands = null;

        public static ICommand Get(string[] args)
        {
            if (commands == null)
            {
                commands = CreateCommandList();
            }
            return commands.FirstOrDefault(cmd => cmd.Called(args));
        }

        private static List<ICommand> CreateCommandList()
        {
            return new List<ICommand>()
            {
                new GenreGetCommand(),
                new GenerateMusicRepositoryHtmlCommand(),
                new UpdateMusicRepositoryCommand(),
            };
        }
    }
}
