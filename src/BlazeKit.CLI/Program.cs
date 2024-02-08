// See https://aka.ms/new-console-template for more information
using BlazeKit.CLI;
using BlazeKit.CLI.Commands.Add;
using BlazeKit.CLI.Commands.Build;
using BlazeKit.CLI.Commands.New;
using BlazeKit.CLI.Commands.Run;
using Spectre.Console;
using Spectre.Console.Cli;
using System.Diagnostics;

Console.OutputEncoding = System.Text.Encoding.UTF8;
//Debugger.Launch();

var app = new Spectre.Console.Cli.CommandApp();
app.Configure(config =>
{
    config.SetHelpProvider(new CustomHelpProvider(config.Settings));
    config.AddCommand<NewCommand>("new");
    config.AddBranch<RunSettings>("run", c => {
        c.AddCommand<DevCommand>("dev");
        c.AddCommand<TailwindCommand>("tailwind");
    });
    config.AddCommand<BuildCommand>("build");
    config.AddBranch<CommandSettings>("add", c => {
        c.AddCommand<TailwindcssCommand>("tailwindcss");
    });
});
return app.Run(args);
