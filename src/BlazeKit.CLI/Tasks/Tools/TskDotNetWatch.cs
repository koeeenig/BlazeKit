using BlazeKit.CLI.Commands.New;
using BlazeKit.CLI.Tasks.Utils;

namespace BlazeKit.CLI.Tasks.Tools
{
    internal class TskDotNetWatch : TskEnveleope
    {
        public TskDotNetWatch(RunSettings settings,Action<string> output, CancellationTokenSource cancel) : base(() =>
        {
            return
                new CancableProcess(
                    new ExecCliCommand(
                        "dotnet", (msg) => output(msg),
                        // "watch", settings.Dotnet ?? "--non-interactive"
                        "watch", settings.Dotnet ?? ""
                    ),
                    cancel.Token
                ).Invoke();
        })
        { }
    }
}
