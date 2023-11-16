using Spectre.Console;
using Spectre.Console.Cli;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.IO.Compression;
using Yaapii.Atoms.IO;

namespace BlazeKit.CLI.Commands.New
{
    public sealed class NewCommand : AsyncCommand<NewSettings>
    {
        public NewCommand()
        { }

        public override async Task<int> ExecuteAsync([NotNull] CommandContext context, [NotNull] NewSettings settings)
        {
            var projectDir = Path.Combine(Directory.GetCurrentDirectory(), settings.Name);
            if(Directory.Exists(projectDir))
            {
                AnsiConsole.MarkupLine($"[red]Error:[/] Directory [bold]{projectDir}[/] already exists.");
                return 1;
            }

            Directory.CreateDirectory(projectDir);

            // Ask for the user which template to use
            var blazorAppType = AnsiConsole.Prompt(
                new SelectionPrompt<string>()
                    .Title("Hosting model?")
                    .PageSize(10)
                    .MoreChoicesText("[grey](Move up and down to reveal more fruits)[/]")
                    .AddChoices(new[] {
                        "Blazor WebAssembly",
                        "Blazor Server"
                    }));

            var template = "TPL_NEW_PROJECT.zip";
            switch (blazorAppType) {
                case "Blazor WebAssembly":
                    template = "TPL_NEW_PROJECT.zip";
                    break;
                case "Blazor Server":
                    template = "TPL_NEW_PROJECT_SERVER.zip";
                    break;
            }

            using (var zip = new ZipArchive(new ResourceOf($"Commands/New/Assets/{template}", this.GetType()).Stream()))
            {
                zip.ExtractToDirectory(projectDir);
            }

            foreach (var file in Directory.GetFiles(projectDir, "*.*",SearchOption.AllDirectories))
            {
                File.WriteAllText(file, File.ReadAllText(file).Replace("[PROJECTNAME]", settings.Name));
            }
            // rename the csproj file
            var csproj = Directory.GetFiles(projectDir, "*.csproj", SearchOption.TopDirectoryOnly);
            if(csproj.Length == 1)
            {
                File.Move(csproj[0], Path.Combine(projectDir,$"{settings.Name}.csproj"));
            }

            // print a list of created files
            AnsiConsole.MarkupLine($"[bold]Created files:[/]");
            foreach (var file in Directory.GetFiles(projectDir, "*.*", SearchOption.AllDirectories))
            {
                AnsiConsole.MarkupLine($"[green]{file.Replace(projectDir, "").TrimStart('/','\\')}[/]");
            }

            AnsiConsole.WriteLine();
            AnsiConsole.MarkupLine($"[green]Project [bold]{settings.Name}[/] created.[/]");

            return 0;
        }
    }
}
