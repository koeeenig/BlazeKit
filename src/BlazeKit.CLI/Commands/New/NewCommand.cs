using Spectre.Console;
using Spectre.Console.Cli;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;

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

             // Ask for the user which template to use
            var blazorAppType = AnsiConsole.Prompt(
                new SelectionPrompt<string>()
                    .Title("Choose which type of Blazor App you would like to scaffold:")
                    .PageSize(10)
                    .MoreChoicesText("[grey](Move up and down to reveal more fruits)[/]")
                    .AddChoices(new[] {
                        "Blazor WebAssembly",
                        "Blazor WebApp"
                    }));

             switch (blazorAppType) {
                case "Blazor WebAssembly":
                    AnsiConsole.Status()
                        .Start("Creating Blazor WebAssembly project...", ctx =>
                        {
                            ctx.Spinner(Spinner.Known.Star);
                            ctx.SpinnerStyle(Style.Parse("green"));
                            CreateWasmProject(settings);
                        });
                    break;
                case "Blazor WebApp":
                    AnsiConsole.Status()
                        .Start("Creating Blazor WebApp project...", ctx =>
                        {
                            ctx.Spinner(Spinner.Known.Star);
                            ctx.SpinnerStyle(Style.Parse("green"));
                            CreateWebAppProject(settings);
                        });
                    break;
                default:
                    AnsiConsole.MarkupLine($"[red]Error:[/] Unknown Blazor App type [bold]{blazorAppType}[/].");
                    return 1;
            }

            // list all created files in the project directory
            AnsiConsole.MarkupLine("[yellow]Created files:[/]");
            foreach(var file in Directory.GetFiles(projectDir, "*", SearchOption.AllDirectories))
            {
                AnsiConsole.MarkupLine($"[green]{file.Replace(projectDir, "")}[/]");
            }

            AnsiConsole.WriteLine();
            AnsiConsole.MarkupLine($"[green]Project [bold]{settings.Name}[/] created.[/]");

            return 0;
        }

        private async void CreateWebAppProject(NewSettings settings)
        {
            var projectDir = Path.Combine(Directory.GetCurrentDirectory(), settings.Name);
            // call dotnet new
            DotNetNewProject(settings, "blazor");

            AnsiConsole.MarkupLine("[yellow]Scaffolding BlazeKit into the project...[/]");
            // remove the Component/Layout folder
            Directory.Delete(Path.Combine(projectDir, "Components", "Layout"), true);
            // remove the first line of the Components/Pages.Error.razor file
            var lines = File.ReadAllLines(Path.Combine(projectDir, "Components", "Pages", "Error.razor"));

            new FileInfo(Path.Combine(projectDir, "Routes", "Error", "Page.razor")).Directory.Create();
            File.WriteAllLines(Path.Combine(projectDir, "Routes", "Error", "Page.razor"), lines.Skip(1).ToArray());

            // move the Components/Pages/App.razor and Components/Pages/_Imports.razor to the project directory
            File.Move(Path.Combine(projectDir, "Components", "App.razor"), Path.Combine(projectDir, "App.razor"));
            File.Move(Path.Combine(projectDir, "Components", "_Imports.razor"), Path.Combine(projectDir, "_Imports.razor"));
            // replace Layout.MainLayout with Layout int Routes.razor
            var lines2 = File.ReadAllLines(Path.Combine(projectDir, "Components", "Routes.razor"));
            File.WriteAllLines(Path.Combine(projectDir, "Components", "Routes.razor"), lines2.Select(l => l.Replace("Layout.MainLayout", $"{new SanititizedNamespace(settings.Name).Value}.Routes.Layout")).ToArray());

            // remove the Components/Pages folder
            Directory.Delete(Path.Combine(projectDir, "Components", "Pages"), true);

            // create a layout.razor in the Routes directory with the following content:
            // @inherits LayoutComponentBase
            // @Body
            File.WriteAllText(Path.Combine(projectDir, "Routes", "Layout.razor"), "@inherits LayoutComponentBase\n@Body");

            // replace first line in Program.cs with using BlazKit
            var lines3 = File.ReadAllLines(Path.Combine(projectDir, "Program.cs"));
            File.WriteAllLines(Path.Combine(projectDir, "Program.cs"), lines3.Select((l, i) => i == 0 ? $"using {new SanititizedNamespace(settings.Name).Value};" : l).ToArray());

            // add BlazeKit packages with dotnet add packe
            AddNuGetPackage(projectDir, "BlazeKit");
            AddNuGetPackage(projectDir, "BlazeKit.Reactivity");

            // add a Routes folder in the porject directory using System.IO
            Directory.CreateDirectory(Path.Combine(projectDir, "Routes"));
            // add a Page.razor file in the Routes folder using System.IO
            File.WriteAllText(Path.Combine(projectDir, "Routes", "Page.razor"), "<h1>Welcome to BlazeKit 👋</h1>");
        }

        private static void DotNetNewProject(NewSettings settings, string template)
        {
            var process =
                Process.Start(
                    new ProcessStartInfo("dotnet", $"new {template} -e -o {settings.Name}")
                    {
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        // WorkingDirectory = Directory.GetCurrentDirectory()
                    }

                );

                process.OutputDataReceived += (sender, args) => AnsiConsole.MarkupLine(args.Data);
                process.ErrorDataReceived += (sender, args) => AnsiConsole.MarkupLine($"[red]{args.Data}[/]");

                process.WaitForExit();
        }

        private static void AddNuGetPackage(string projectDir, string package)
        {
            var process =
                Process.Start(
                    new ProcessStartInfo("dotnet", $"add package {package}")
                    {
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        WorkingDirectory = projectDir
                    }
                );

            process.OutputDataReceived += (sender, args) => AnsiConsole.MarkupLine(args.Data);
            process.ErrorDataReceived += (sender, args) => AnsiConsole.MarkupLine($"[red]{args.Data}[/]");
            process.WaitForExit();
        }

        private void CreateWasmProject(NewSettings settings)
        {
            var projectDir = Path.Combine(Directory.GetCurrentDirectory(), settings.Name);
            // call dotnet new
            DotNetNewProject(settings, "blazorwasm");

            AnsiConsole.MarkupLine("[yellow]Scaffolding BlazeKit into the project...[/]");
            // remove the PAges directory
            Directory.Delete(Path.Combine(projectDir, "Pages"), true);
            // remove the layout directory
            Directory.Delete(Path.Combine(projectDir, "Layout"), true);
            // remove the last line of the _Imports.razor file
            var lines = File.ReadAllLines(Path.Combine(projectDir, "_Imports.razor"));
            File.WriteAllLines(Path.Combine(projectDir, "_Imports.razor"), lines.Take(lines.Length - 1).ToArray());

            // replace Layout.MainLayout with Layout int Routes.razor
            var lines2 = File.ReadAllLines(Path.Combine(projectDir, "App.razor"));
            File.WriteAllLines(Path.Combine(projectDir, "App.razor"), lines2.Select(l => l.Replace("MainLayout", $"{new SanititizedNamespace(settings.Name).Value}.Routes.Layout")).ToArray());

            // add a Routes folder in the porject directory using System.IO
            Directory.CreateDirectory(Path.Combine(projectDir, "Routes"));
            // add a Page.razor file in the Routes folder using System.IO
            File.WriteAllText(Path.Combine(projectDir, "Routes", "Page.razor"),"<h1>Welcome to BlazeKit 👋</h1>");

            // create a layout.razor in the Routes directory with the following content:
            // @inherits LayoutComponentBase
            // @Body
            File.WriteAllText(Path.Combine(projectDir, "Routes", "Layout.razor"), "@inherits LayoutComponentBase\n@Body");



            // add BlazeKit packages with dotnet add packe
            AddNuGetPackage(projectDir, "BlazeKit");
            AddNuGetPackage(projectDir, "BlazeKit.Reactivity");
        }
    }
}
