// See https://aka.ms/new-console-template for more information
using BlazeKit.CLI;
using BlazeKit.CLI.Commands.Add;
using BlazeKit.CLI.Commands.Build;
using BlazeKit.CLI.Commands.New;
using Spectre.Console;
using Spectre.Console.Cli;

Console.OutputEncoding = System.Text.Encoding.UTF8;


var app = new Spectre.Console.Cli.CommandApp();
app.Configure(config =>
{
    config.SetHelpProvider(new CustomHelpProvider(config.Settings));
    config.AddCommand<NewCommand>("new");
    config.AddBranch<RunSettings>("run", c => {
        c.AddCommand<DevCommand>("dev");
        c.AddCommand<BuildCommand>("build");
    });
    config.AddBranch<CommandSettings>("add", c => {
        c.AddCommand<TailwindcssCommand>("tailwindcss");
    });
});
return app.Run(args);
