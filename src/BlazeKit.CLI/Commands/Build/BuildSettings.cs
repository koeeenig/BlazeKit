using Spectre.Console.Cli;
using System.ComponentModel;

namespace BlazeKit.CLI.Commands.Build
{
    public sealed class BuildSettings : Run.RunSettings
    {
        [CommandOption("-p|--project <PROJECT>")]
        public string Project { get; set; }

        [CommandOption("-t|--tailwindcss")]
        [DefaultValue("")]
        public string Tailwindcss { get; set; }

        [CommandOption("-d|--dotnet")]
        [DefaultValue("")]
        public string Dotnet { get; set; }

        [CommandOption("-o|--output")]
        [DefaultValue(".blazekit/build")]
        public string Output { get; set; }
    }
}
