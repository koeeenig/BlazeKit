using BlazeKit.Abstraction.Config;
using BlazeKit.CLI.Commands.New;
using BlazeKit.CLI.Tasks;
using BlazeKit.CLI.Tasks.Tasks;
using BlazeKit.CLI.Tasks.Tools;
using Spectre.Console;
using Spectre.Console.Cli;
using System.Diagnostics;
using System.Text;
using Yaapii.Atoms.List;

namespace BlazeKit.CLI;

public class DevCommand : AsyncCommand<RunSettings>
{
    public override async Task<int> ExecuteAsync(CommandContext context, RunSettings settings)
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
            
            // load blazekit.config.json file if it exists
            if (hasTailwindcss && string.IsNullOrEmpty(settings.Tailwindcss))
            {
                var input = bkConfig.Tailwindcss.Input;
                var output = bkConfig.Tailwindcss.Output;

                settings.Tailwindcss = $"-i {input} -o {output} --watch";
            }

            if(settings.UseLayoutView)
            {
                AlternateOrClearScreen(() => UseLayout(settings,hasTailwindcss));
            } else
            {
                // run dotnet watch command
                AnsiConsole.MarkupLine("[yellow]Starting BlazeKit Dev Mode...[/]");

                var cancel = new CancellationTokenSource();
                var dotnetLines = new List<string>();
                var tailwind = new List<string>();
                var devTask =
                    new TskChain(
                        new TskDotNetWatch(
                            settings,
                            output => {
                                AnsiConsole.MarkupLine($"[purple]{$"[DOTNET WATCH {Emoji.Known.MagnifyingGlassTiltedRight}]".EscapeMarkup()} {output.EscapeMarkup()}[/]");
                            },
                            cancel
                        ),
                        new TskWhen(
                            () => hasTailwindcss,
                            new TskTailwindCss(
                                settings,
                                output => {
                                    AnsiConsole.MarkupLine($"[blue]{$"[TAILWINDCSS {Emoji.Known.ArtistPalette}]".EscapeMarkup()} {output.EscapeMarkup()}[/]");
                                },
                                cancel
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
                            Console.WriteLine("CTRL+C pressed");
                            AnsiConsole.MarkupLine("[yellow]Stopping dev mode...[/]");
                            cancel.Cancel();
                            break;
                        }
                        await Task.Delay(100);
                    }
                });
                Task.WaitAll(devTask);
            }

            AnsiConsole.MarkupLine("[yellow]Stopped BlazeKit Dev Mode...[/]");


        }
        catch (Exception ex)
        {
            AnsiConsole.WriteException(ex);
        }
        return 0;
    }


    private void AlternateOrClearScreen(Action action)
    {
        if (AnsiConsole.Profile.Capabilities.AlternateBuffer)
        {
            AnsiConsole.MarkupLine("[yellow]Starting BlazeKit Dev Mode...[/]");
            AnsiConsole.AlternateScreen(action);
        }
        else
        {
            AnsiConsole.Clear();
            action();
        }
    }

    private async void UseLayout(RunSettings settings, bool hasTailwindcss)
    {
        var outputLayouts = hasTailwindcss ? ListOf.New(new Layout("Left"), new Layout("Right")) : ListOf.New(new Layout("Left"));
        // Create the layout
        var layout =
            new Layout("Root")
            .SplitRows(
                new Layout("Top")
                    .SplitColumns(
                        outputLayouts.ToArray()
                    ),
                new Layout("Bottom").Size(2)
                    .Update(new Markup("[yellow]Press CTRL+C to stop dev mode...[/]"))
            );



        await AnsiConsole.Live(layout).StartAsync(async ctx =>
        {
            var cancel = new CancellationTokenSource();
            var dotnetLines = new List<string>();
            var tailwind = new List<string>();
            var devTask =
                new TskChain(
                    new TskDotNetWatch(
                        settings,
                        output => {
                            // Update the left column
                            var sw = Stopwatch.StartNew();
                            dotnetLines.Add(output.EscapeMarkup());
                            var size = (int)(Console.WindowHeight * 0.5);
                            var snapshot = dotnetLines.TakeLast(size).ToList();
                            var panel =
                                new Panel(
                                    Align.Left(
                                        new Markup(string.Join(Environment.NewLine, snapshot)),
                                        VerticalAlignment.Top
                                    )
                                ).Expand();
                            panel.Header = new PanelHeader(".NET", Justify.Left);

                            layout["Left"]
                                .Update(
                                  panel
                                );
                            
                            ctx.Refresh();
                            Debug.WriteLine($"Refresh took {sw.ElapsedMilliseconds}ms");
                        },
                        cancel
                    ),
                    new TskWhen(
                        () => hasTailwindcss,
                        new TskTailwindCss(
                            settings,
                            output => {

                                tailwind.Add(output.EscapeMarkup());
                                var size = (int)(Console.WindowHeight * 0.5);
                                var snapshot = tailwind.TakeLast(size).ToList();
                                var panel =
                                    new Panel(
                                    Align.Left(
                                        new Markup(string.Join(Environment.NewLine, snapshot)),
                                        VerticalAlignment.Top
                                    )
                                ).Expand();
                                panel.Header = new PanelHeader("Tailwindcss", Justify.Left);
                                layout["Right"]
                                    .Update(
                                        panel
                                    );
                                ctx.Refresh();
                                //AnsiConsole.MarkupLine($"[blue]{$"[TAILWINDCSS {Emoji.Known.ArtistPalette}]".EscapeMarkup()} {output.EscapeMarkup()}[/]");
                            },
                            cancel
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
                        Console.WriteLine("CTRL+C pressed");
                        AnsiConsole.MarkupLine("[yellow]Stopping dev mode...[/]");
                        cancel.Cancel();
                        break;
                    }
                    await Task.Delay(100);
                }
            });
            Task.WaitAll(devTask);
        });
        AnsiConsole.MarkupLine("[yellow]Stopped BlazeKit Dev Mode...[/]");
    }
}
