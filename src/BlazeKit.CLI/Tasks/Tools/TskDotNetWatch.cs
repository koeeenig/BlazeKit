using BlazeKit.CLI.Commands.New;
using BlazeKit.CLI.Tasks.Utils;
using Spectre.Console;
using BlazeKit.CLI;
using BlazeKit.CLI.Commands.Run;
using System.Diagnostics;
namespace BlazeKit.CLI.Tasks.Tools
{
    internal class TskDotNetWatch : TskEnveleope
    {
        public TskDotNetWatch(DevSettings settings,Action<string> output, CancellationTokenSource cancel) : base(() =>
        {
            var watchProcess =
                new ExecCliCommand(
                    "dotnet",
                    (msg) =>  output(msg),
                    info => info.EnvironmentVariables.Add("DOTNET_SYSTEM_CONSOLE_ALLOW_ANSI_COLOR_REDIRECTION", "True"),
                    "watch --non-interactive", settings.Dotnet ?? ""
                );



            return
                new CancableProcess(
                    watchProcess,
                    cancel.Token
                ).Invoke();
        })
        { }
    }
}
