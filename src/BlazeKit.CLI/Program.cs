// See https://aka.ms/new-console-template for more information
using BlazeKit.CLI.Commands.Deployment;
using BlazeKit.CLI.Commands.New;
using Spectre.Console.Cli;

var app = new Spectre.Console.Cli.CommandApp();
app.Configure(config =>
{
    config.AddCommand<NewCommand>("new");
    config.AddBranch("add", add =>
    {
        add.AddCommand<VercelCommand>("vercel");
    });
});

return app.Run(args);
