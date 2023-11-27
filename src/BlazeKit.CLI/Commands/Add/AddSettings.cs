using Spectre.Console.Cli;

namespace BlazeKit.CLI.Commands.Deployment
{
    public class AddSettings : CommandSettings
    {
        [CommandArgument(0, "[project]")]
        public string Project { get; set; } = "";
    }
}
