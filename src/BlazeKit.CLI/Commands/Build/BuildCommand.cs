using BlazeKit.Abstraction.Config;
using BlazeKit.CLI.Tasks.Utils;
using Spectre.Console;
using Spectre.Console.Cli;
using System.Runtime.Loader;

namespace BlazeKit.CLI.Commands.Build;

public class BuildCommand : Command<BuildSettings>
{
    public override int Execute(CommandContext context, BuildSettings settings)
    {
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

                settings.Tailwindcss = $"-i {input} -o {output} --minify";
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

        Task.WhenAll(publishTask).Wait();

        // var tempOutput = bkConfig.PreRender ? ".blazekit/tmp/" : settings.Output;
        var tempOutput = bkConfig.Adapter == BuildAdapter.SSG ? Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString()) : settings.Output;
        // clean the temp output directory
        if (Directory.Exists(tempOutput))
        {
            AnsiConsole.MarkupLine($"[yellow]Cleaning {tempOutput}...[/]");
            Directory.Delete(tempOutput, true);
        }
        publishTask =
            Task.Run(async () =>
            {
                var process =
                    new ExecCliCommand(
                        "dotnet",
                        output =>
                        {
                            AnsiConsole.MarkupLine($"{output.EscapeMarkup()}");
                        },
                        info => info.EnvironmentVariables.Add("DOTNET_SYSTEM_CONSOLE_ALLOW_ANSI_COLOR_REDIRECTION", "True"),
                        (string.IsNullOrEmpty(settings.Dotnet) ? "publish -c Debug" : settings.Dotnet) + $" -o {tempOutput}"
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


        Task.WhenAll(publishTask).Wait();
        // check if preprender is enabled
        if(bkConfig.Adapter == BuildAdapter.SSG)
        {
            // pre-render the app (SSG output)
            AnsiConsole.MarkupLine("[yellow] Pre-rendering app...[/]");
            // get the name of the csproj file in the current directory
            var csproj = new FileInfo(Directory.GetFiles(Directory.GetCurrentDirectory(), "*.csproj").FirstOrDefault());
            // find the assembly name from the csproj file
            var assemblyName = csproj.Name.Replace(csproj.Extension, "");
            // get the path to the assembly
            var assemblyPath = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), tempOutput, assemblyName + ".dll"));
            // use BlazeKit.Static to pre-render the app
            System.Runtime.Loader.AssemblyLoadContext loadCtx = new AssemblyLoadContext("ssg",isCollectible:true);
            loadCtx.Resolving += (ctx, name) =>
            {
                AnsiConsole.MarkupLine($"Resolving assembly '{name.Name}'");

                var resolved = ctx.LoadFromAssemblyPath(Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), tempOutput, name.Name + ".dll")));
                if(resolved != null)
                {
                    AnsiConsole.MarkupLine($"Resolved assembly '{name.Name}'");
                } else {
                    AnsiConsole.MarkupLine($"Failed to resolve assembly '{name.Name}'");
                }

                return resolved;
            };
            AnsiConsole.MarkupLine($"Try load assembly '{assemblyPath}'");
            var asm = loadCtx.LoadFromAssemblyPath(assemblyPath);
            var ssg = new BlazeKit.Static.StaticSiteGenerator(settings.Output,Path.Combine(tempOutput,"wwwroot"),asm);
            ssg.Build().Wait();
            AnsiConsole.MarkupLine($"[green]Succesfully created static site at '{settings.Output}'[/]");

            // loadCtx.Unload();
            // delete the temp output directory
            // TODO: throws Error: Access to the path 'BlazeKit.Abstraction.dll' is denied.
            // Directory.Delete(tempOutput, true);
        }



        // // Wait for CTRL+C input to cancel running dotnet watch
        // AnsiConsole.MarkupLine("[yellow]Press CTRL+C to stop dotnet watch...[/]");
        // // Start a console read operation. Do not display the input.
        // Console.TreatControlCAsInput = true;
        // var cancelTask = Task.Run(async () =>
        // {
        //     while (true)
        //     {
        //         var key = Console.ReadKey(true);
        //         if (key.Key == ConsoleKey.C && key.Modifiers == ConsoleModifiers.Control)
        //         {
        //             Console.WriteLine("CTRL+C pressed");
        //             cancel.Cancel();
        //             break;
        //         }
        //         await Task.Delay(100);
        //     }
        // });

        return 0;
    }
}
