using System.Net;
using Spectre.Console.Cli;

namespace BlazeKit.CLI.Commands.Deployment;
public sealed class AddCommand : AsyncCommand<AddSettings>
{
    public override Task<int> ExecuteAsync(CommandContext context, AddSettings settings)
    {
        return Task.FromResult(0);
    }
}
