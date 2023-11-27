using System.ComponentModel;
using System.Diagnostics;
using System.Xml.Linq;
using System.Xml.XPath;
using Spectre.Console;
using Spectre.Console.Cli;
using Yaapii.Xml;

namespace BlazeKit.CLI.Commands.Deployment;
public sealed class VercelCommand : AsyncCommand<VercelSettings>
{
    public override Task<int> ExecuteAsync(CommandContext context, VercelSettings settings)
    {
        if (string.IsNullOrEmpty(settings.Project) && HasProjectInDirectory(Directory.GetCurrentDirectory()))
        {
            settings.Project = Directory.GetFiles(Directory.GetCurrentDirectory(), "*.csproj", SearchOption.TopDirectoryOnly)[0];
        }
        else
        {
            // check wether the project is a csproj file or it is a folder and contains a csproj file
            if (!File.Exists(settings.Project) && Directory.Exists(settings.Project))
            {
                // the provided path is a directory -> look for a csproj in it
                var projects =  Directory.GetFiles(settings.Project, "*.csproj", SearchOption.TopDirectoryOnly);
                if(projects.Count() == 1) {
                    settings.Project = projects[0];
                } else
                {
                    // search for projects int he directory and ask the user which one to use
                    projects =  Directory.GetFiles(settings.Project, "*.csproj", SearchOption.AllDirectories);
                    // Ask for the user for the project to add the deployment to
                    var selected =
                        AnsiConsole.Prompt(
                            new SelectionPrompt<Tuple<string,string>>()
                                .Title("Select the project to add the Vercel deployment to:")
                                .PageSize(10)
                                .MoreChoicesText("[grey](Move up and down to reveal more projects)[/]")
                                .AddChoices<Tuple<string,string>>(projects.Select(p => new Tuple<string,string>(Path.GetFileNameWithoutExtension(p),p))
                            )
                        );

                    settings.Project = selected.Item2;
                }
            }
        }

        if(!IsWasmProject(settings.Project)) {
            AnsiConsole.MarkupLine($"[red]Cannot add Deployment for [bold]Vercel[/] because the project [bold]{Path.GetFileNameWithoutExtension(settings.Project)}[/] is not a Blazor WebAssembly project.[/]");
            return Task.FromResult(0);
        }

        AnsiConsole.MarkupLine($"[blue]Deployment for [bold]Vercel[/] will be added to project [bold]{Path.GetFileNameWithoutExtension(settings.Project)}[/][/]");
        var projectDirectory = new FileInfo(settings.Project).Directory!.FullName;



        // check if ainstall.sh or vercel.json already exists
        if (File.Exists(Path.Combine(projectDirectory, ".vercel", "install.sh")) || File.Exists(Path.Combine(projectDirectory, "vercel.json")))
        {
            AnsiConsole.MarkupLine($"[yellow]Deployment for [bold]Vercel[/] has already been added to project {Path.GetFileNameWithoutExtension(settings.Project)}[/]");
            // ask if the files should be overwritten
            var result = AnsiConsole.Confirm("Do you want to overwrite the existing files?", defaultValue: true);
            if (!result)
            {
                return Task.FromResult(0);
            }
        }

        // run dotnet add package BlazeKit.Deployment.Vercel
        var version = new BlazeKitVersion().Value;
        AnsiConsole.MarkupLine("Install NuGet Package [bold]BlazeKit.Deployment.Vercel[/] Version [bold]{0}[/]", version.ToString());
        AddNuGetPackage(settings, version);

        // we got the project directory
        // now we need to add a vercel.json file to the project directory
        File.WriteAllText(Path.Combine(projectDirectory, "vercel.json"), @$"{{
           ""buildCommand"": ""/vercel/.dotnet/dotnet build ""{settings.Project}"" -c Release ; /vercel/.dotnet/dotnet publish ""{settings.Project}"" -c Release"",
            ""installCommand"": ""chmod +x ./vercel/install.sh ; ./vercel/install.sh; export DOTNET_ROOT=$HOME/.dotnet ; export PATH=$PATH:$DOTNET_ROOT:$DOTNET_ROOT/tools ; /vercel/.dotnet/dotnet --version"",
            ""outputDirectory"": "".vercel/output/static""
        }}".Replace('\\', '/'));


        var vercelDirectory = new DirectoryInfo(Path.Combine(projectDirectory, ".vercel"));
        if (!vercelDirectory.Exists)
        {
            vercelDirectory.Create();
        }

        File.WriteAllText(Path.Combine(projectDirectory, ".vercel", "install.sh"), @"
            #!/usr/bin/env bash
            yum -y install wget tar gzip libicu
            wget https://dot.net/v1/dotnet-install.sh -O dotnet-install.sh
            chmod +x ./dotnet-install.sh
            ./dotnet-install.sh --version latest
        ");


        // print the created files with relative path
        AnsiConsole.MarkupLine("[yellow]Created files:[/]");
        AnsiConsole.MarkupLine($"[yellow].vercel{Path.DirectorySeparatorChar}install.sh[/]");
        AnsiConsole.MarkupLine($"[yellow].{Path.DirectorySeparatorChar}vercel.json[/]");
        AnsiConsole.MarkupLine($"{Environment.NewLine}[green]Added Vercel deployment to project [bold]{Path.GetFileNameWithoutExtension(settings.Project)}[/].[/]");

        return Task.FromResult(0);

    }

    private static void AddNuGetPackage(AddSettings settings, string version)
    {
        var process = new Process();
        process.StartInfo.FileName = "dotnet";
        process.StartInfo.Arguments = $"add {settings.Project} package BlazeKit.Deployment.Vercel --version {version}";
        process.StartInfo.UseShellExecute = false;
        process.StartInfo.RedirectStandardOutput = true;
        process.StartInfo.RedirectStandardError = true;
        process.OutputDataReceived += (sender, args) => AnsiConsole.MarkupLine($"[grey]{args.Data?.EscapeMarkup()}[/]");
        process.ErrorDataReceived += (sender, args) => AnsiConsole.MarkupLine($"[red]{args.Data?.EscapeMarkup()}[/]");
        process.Start();
        process.BeginOutputReadLine();
        process.BeginErrorReadLine();
        process.WaitForExit();
    }

    private bool HasProjectInDirectory(string directory) {
        return Directory.GetFiles(directory, "*.csproj", SearchOption.TopDirectoryOnly).Length == 1;
    }

    private bool IsWasmProject(string csproj) {
        var result = false;
        var xml = new Yaapii.Xml.XMLCursor(File.ReadAllText(csproj));
        var sdk = new XMLString(xml,"/Project/@Sdk").Value();
        result = sdk.Equals("Microsoft.NET.Sdk.BlazorWebAssembly", StringComparison.InvariantCultureIgnoreCase);

        return result;
    }
}
