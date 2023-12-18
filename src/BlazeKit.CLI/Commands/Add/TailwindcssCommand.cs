using BlazeKit.CLI.Tasks.Utils;
using Spectre.Console;
using Spectre.Console.Cli;
using Yaapii.Atoms.IO;
using Yaapii.Atoms.Text;

namespace BlazeKit.CLI.Commands.Add;
public class TailwindcssCommand : AsyncCommand
{
    public override async Task<int> ExecuteAsync(CommandContext context)
    {
        // check if tailwindcss cli is installed as dotnet global tool
        var installed = false;
        new ExecCliCommand("dotnet", (output) => {
            if(output.Contains("tailwindcss.cli")) {
                installed = true;
            }
            },
                "tool", "list", "-g"
        )
        .Run()
        .WaitForExit();

        if(!installed) {
            AnsiConsole.MarkupLine("[yellow]Tailwindcss CLI is not installed as dotnet global tool... let's fix this.[/]");
            var installTailwindCli = AnsiConsole.Confirm("Install Standalone Tailwindcss CLI from 'tailwindcss.cli' Nuget Package?", defaultValue:true);
            if(!installTailwindCli)
            {
                AnsiConsole.MarkupLine("[ornage]Tailwindcss CLI has not been installed. Adding Tailwindcss support canceled.[/]");
                return -1;
            }
            // check if tailwindcss global tool is installed
            await
                Task.Run(() => {
                    var process =
                        new ExecCliCommand(
                            "dotnet",
                            (output) => {
                                AnsiConsole.MarkupLine($"[purple]{$"[DOTNET]".EscapeMarkup()} {output.EscapeMarkup()}[/]");
                            },
                            "tool", "install", "-g", "tailwindcss.cli"
                        ).Run();

                    process.WaitForExit();
                });

            // write to console that tailwindcss cli has been installed as dotnet global tool
            AnsiConsole.MarkupLine("[yellow]Tailwindcss CLI has been installed as dotnet global tool.[/]");
        }

        // check if tailwindcss config file exists
        if(File.Exists("tailwind.config.js")) {
            // prompt for overwrite
            var overwrite = AnsiConsole.Confirm("tailwind.config.js already exists. Do you want to overwrite it?");
            if(!overwrite) {
                AnsiConsole.MarkupLine("[yellow]Tailwindcss config file has not been overwritten.[/]");
                return 0;
            } else {
                // delete tailwindcss config file
                File.Delete("tailwind.config.js");
            }
        }

        // Add tailwindcss config file
        File.WriteAllText("tailwind.config.js", new TextOf(new ResourceOf("Templates/tailwind.config.js", this.GetType())).AsString());

        // write to console that tailwindcss config has been updated
        AnsiConsole.MarkupLine("[yellow]tailwind.config.js has been updated for BlazeKit.[/]");

        return 0;
    }
}
