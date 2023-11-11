using Spectre.Console.Cli;

namespace BlazeKit.CLI.Commands.New
{
    public sealed class NewSettings : CommandSettings
    {
        [CommandArgument(0,"<name>")]
        public string Name { get; set; }
    }
}
