using BlazeKit.Abstraction.Config;
using BlazeKit.CLI.Commands.Run;
using BlazeKit.CLI.Tasks;
using BlazeKit.CLI.Tasks.Tasks;
using BlazeKit.CLI.Tasks.Tools;
using Spectre.Console;
using Spectre.Console.Cli;
using System.Diagnostics;
using System.Text;
using Yaapii.Atoms.List;

namespace BlazeKit.CLI;

public class TailwindCommand : AsyncCommand<TailwindSettings>
{
    public override async Task<int> ExecuteAsync(CommandContext context, TailwindSettings settings)
    {
        try
        {

            var content = new StringBuilder();
            var tailwindContent = new StringBuilder();


            if (!BkConfig.TryLoad(out var bkConfig))
            {
                AnsiConsole.MarkupLine("[red]blazekit.config.json not found...Using default values[/]");
            }

            var hasTailwindcss = bkConfig.HasTailwindcss();
            var twSettings = "-i app.css -o wwwroot/css/app.css --watch";
            // load blazekit.config.json file if it exists
            if (hasTailwindcss)
            {
                var input = bkConfig.Tailwindcss.Input;
                var output = bkConfig.Tailwindcss.Output;

                twSettings = $"-i {input} -o {output} --watch";
            }

            // run tailwind cli command
            AnsiConsole.MarkupLine("[yellow]Starting Tailwind ...[/]");
            var prefix = $"[Tailwind {Emoji.Known.ArtistPalette}]";
            var cancel = new CancellationTokenSource();
            var tailwind = new List<string>();
            var devTask =
                new TskChain(
                    new TskWhen(
                        () => hasTailwindcss,
                        new TskTailwindCss(
                            output => {
                                AnsiConsole.MarkupLine($"{prefix}  {output}".EscapeMarkup());
                            },
                            cancel,
                            twSettings
                        )
                    )
                ).Run();

            // Wait for CTRL+C input to cancel running dotnet watch
            // Start a console read operation. Do not display the input.
            Console.TreatControlCAsInput = true;
            var cancelTask = Task.Run(async () =>
            {
                while (true)
                {
                    var key = Console.ReadKey(true);
                    if (key.Key == ConsoleKey.C && key.Modifiers == ConsoleModifiers.Control)
                    {
                        AnsiConsole.WriteLine("CTRL+C pressed");
                        AnsiConsole.MarkupLine("[yellow]Stopping Tailwind ...[/]");
                        cancel.Cancel();
                        break;
                    }
                    await Task.Delay(100);
                }
            });
            Task.WaitAll(devTask);

            AnsiConsole.MarkupLine("[yellow]Stopped Tailwind...[/]");


        }
        catch (Exception ex)
        {
            AnsiConsole.WriteException(ex);
        }
        return 0;
    }
}
