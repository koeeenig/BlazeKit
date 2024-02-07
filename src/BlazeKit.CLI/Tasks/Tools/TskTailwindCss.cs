using BlazeKit.CLI.Commands.New;
using BlazeKit.CLI.Tasks.Utils;

namespace BlazeKit.CLI.Tasks.Tasks
{
    internal class TskTailwindCss : TskEnveleope
    {
        public TskTailwindCss(Action<string> output, CancellationTokenSource cancel, params string[] arguments) : base(() =>
        {
            return
                new CancableProcess(
                    new ExecCliCommand(
                        "tailwindcss", (msg) => output(msg),
                        arguments
                    ),
                    cancel.Token
                ).Invoke();
        })
        { }
    }
}
