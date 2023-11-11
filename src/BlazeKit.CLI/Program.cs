// See https://aka.ms/new-console-template for more information
using BlazeKit.CLI.Commands.New;

var app = new Spectre.Console.Cli.CommandApp();
app.Configure(config =>
{
    config.AddCommand<NewCommand>("new");
});

return app.Run(args);
