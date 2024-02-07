using Spectre.Console.Cli;
using System.ComponentModel;

namespace BlazeKit.CLI.Commands.Run
{
    public sealed class DevSettings : RunSettings
    {
        [CommandOption("-p|--project <PROJECT>")]
        public string Project { get; set; }

        [CommandOption("-t|--tailwindcss")]
        [DefaultValue("")]
        public string Tailwindcss { get; set; }

        [CommandOption("-d|--dotnet")]
        [DefaultValue("")]
        public string Dotnet { get; set; }


        [CommandOption("-l|--layout-view")]
        [DefaultValue(false)]
        public bool UseLayoutView { get; set; }
    }
}
