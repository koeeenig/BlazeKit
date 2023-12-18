using Spectre.Console;
using Spectre.Console.Cli;
using Spectre.Console.Cli.Help;
using Spectre.Console.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace BlazeKit.CLI
{
    internal class CustomHelpProvider : HelpProvider
    {
        public CustomHelpProvider(ICommandAppSettings settings) : base(settings)
        {
            
        }

        public override IEnumerable<IRenderable> GetHeader(ICommandModel model, ICommandInfo? command)
        {
            return new List<IRenderable>()
            {
                 Title(),
                Text.NewLine,Text.NewLine,
                new Text("Visit https://blazekit.dev for a more informations"), Text.NewLine,
                Text.NewLine
            };
        }

        private Markup Title()
        {
            return
                 new Markup(@$"
██████  ██       █████  ███████ ███████ ██   ██ ██ ████████
██   ██ ██      ██   ██    ███  ██      ██  ██  ██    ██    
██████  ██      ███████   ███   █████   █████   ██    ██
██   ██ ██      ██   ██  ███    ██      ██  ██  ██    ██
██████  ███████ ██   ██ ███████ ███████ ██   ██ ██    ██    v{this.GetType().Assembly.GetName().Version}
            [deepskyblue4_2][blue]A Meta-Framework for Blazor .NET[/][/]
");
        }
    }
}
