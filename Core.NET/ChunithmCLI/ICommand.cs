using System.Linq;

namespace ChunithmCLI
{
    public interface ICommand
    {
        string GetCommandName();
        bool Called(string[] args) => args?.FirstOrDefault() == GetCommandName();
        void Call(string[] args);
    }
}
