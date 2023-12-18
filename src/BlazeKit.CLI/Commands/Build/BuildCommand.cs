using BlazeKit.CLI.Commands.New;
using BlazeKit.CLI.Tasks.Utils;
using Spectre.Console;
using Spectre.Console.Cli;
using System.Diagnostics;
using System.Text.Json;

namespace BlazeKit.CLI.Commands.Build;

public class BuildCommand : AsyncCommand<RunSettings>
{
    public override async Task<int> ExecuteAsync(CommandContext context, RunSettings settings)
    {
        // load blazekit.config.json file if it exists
        if (File.Exists("blazekit.config.json"))
        {
            AnsiConsole.MarkupLine("[yellow]Loading blazekit.config.json...[/]");
            var config = JsonSerializer.Deserialize<JsonDocument>(File.ReadAllText("blazekit.config.json"));

            config!.RootElement.TryGetProperty("tailwindcss", out var tailwindcss);

            var input = tailwindcss.GetProperty("input").GetString();
            var output = tailwindcss.GetProperty("output").GetString();

            settings.Tailwindcss = $"-i {input} -o {output}";
        }

        // run dotnet watch command
        AnsiConsole.MarkupLine("[yellow] Running Tailwindcss build process...[/]");
        var cancel = new CancellationTokenSource();

        var publishTask =
            Task.Run(async () =>
            {
                var process =
                    new ExecCliCommand(
                        "tailwindcss",
                        output =>
                        {
                            AnsiConsole.MarkupLine($"[blue]{"[TAILWINDCSS]".EscapeMarkup()} {output.EscapeMarkup()}[/]");
                        },
                        string.IsNullOrEmpty(settings.Tailwindcss) ? "-i app.css -o wwwroot/css/app.css --minify" : settings.Tailwindcss
                    ).Run();

                while (!process.HasExited)
                {
                    if (cancel.IsCancellationRequested)
                    {
                        AnsiConsole.MarkupLine("[yellow]Stopping tailwindcss build...[/]");
                        process.Kill();
                        break;
                    }

                    await Task.Delay(500);
                }
            });

        await Task.WhenAll(publishTask);


        publishTask =
            Task.Run(async () =>
            {
                var process =
                    new ExecCliCommand(
                        "dotnet",
                        output =>
                        {
                            AnsiConsole.MarkupLine($"[purple]{$"[DOTNET PUBLISH]".EscapeMarkup()} {output.EscapeMarkup()}[/]");
                        },
                        (string.IsNullOrEmpty(settings.Dotnet) ? "publish -c Release" : settings.Dotnet) + " -o ./blazekit/build"
                    ).Run();

                while (!process.HasExited)
                {
                    if (cancel.IsCancellationRequested)
                    {
                        AnsiConsole.MarkupLine("[yellow]Stopping dotnet publish...[/]");
                        process.Kill();
                        break;
                    }

                    await Task.Delay(500);
                }

            });


        // Wait for CTRL+C input to cancel running dotnet watch
        AnsiConsole.MarkupLine("[yellow]Press CTRL+C to stop dotnet watch...[/]");
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
                    cancel.Cancel();
                    break;
                }
                await Task.Delay(100);
            }
        });

        await Task.WhenAll(publishTask);
        return 0;
    }

    private Process RunDotNetCommand(string command, IList<string> output, IList<string> error, Action<string> refresh, params string[] arguments)
    {
        AnsiConsole.MarkupLine($"[yellow]{"[BlazeKit]".EscapeMarkup()} running 'dotnet {command} {string.Join(" ", arguments)}'[/]");
        // print working directory
        // AnsiConsole.MarkupLine($"[yellow]Working directory: {Directory.GetCurrentDirectory()}[/]");
        var startInfo =
            new ProcessStartInfo("dotnet", $"{command} {string.Join(" ", arguments)}")
            {
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                RedirectStandardInput = true,
                UseShellExecute = false,
                CreateNoWindow = true,
                // DOTNET_WATCH_SUPPRESS_EMOJIS=1
                WorkingDirectory = Directory.GetCurrentDirectory()
            };
        startInfo.Environment.Add("DOTNET_WATCH_SUPPRESS_EMOJIS", "1");
        var process =
            Process.Start(
                startInfo
            );
        process.EnableRaisingEvents = true;
        process.OutputDataReceived += (sender, args) => { output.Add(args.Data); refresh(args.Data); };
        process.ErrorDataReceived += (sender, args) => { error.Add(args.Data); refresh(args.Data); };

        process.BeginOutputReadLine();
        process.BeginErrorReadLine();

        return process;
    }

    private Process RunTailwindcss(string command, IList<string> output, IList<string> error, Action<string> refresh, params string[] arguments)
    {
        AnsiConsole.MarkupLine($"[yellow]{"[BlazeKit]".EscapeMarkup()} running 'tailwindcss {command} {string.Join(" ", arguments)}'[/]");
        // print working directory
        // AnsiConsole.MarkupLine($"[yellow]Working directory: {Directory.GetCurrentDirectory()}[/]");
        var startInfo =
            new ProcessStartInfo("tailwindcss", $"{command} {string.Join(" ", arguments)}")
            {
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                RedirectStandardInput = true,
                UseShellExecute = false,
                CreateNoWindow = true,
                // DOTNET_WATCH_SUPPRESS_EMOJIS=1
                WorkingDirectory = Directory.GetCurrentDirectory()
            };

        var process =
            Process.Start(
                startInfo
            );
        process.EnableRaisingEvents = true;
        process.OutputDataReceived += (sender, args) => { output.Add(args.Data); refresh(args.Data); };
        process.ErrorDataReceived += (sender, args) => { error.Add(args.Data); refresh(args.Data); };

        process.BeginOutputReadLine();
        process.BeginErrorReadLine();

        return process;
    }
}
