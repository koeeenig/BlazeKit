using BlazeKit.CLI.Commands.New;
using BlazeKit.CLI.Tasks.Utils;

namespace BlazeKit.CLI.Tasks.Tasks
{
    internal class TskTailwindCss : TskEnveleope
    {
        public TskTailwindCss(RunSettings settings, Action<string> output, CancellationTokenSource cancel) : base(() =>
        {
            return
                new CancableProcess(
                    new ExecCliCommand(
                        "tailwindcss", (msg) => output(msg),
                        string.IsNullOrEmpty(settings.Tailwindcss) ? "-i app.css -o wwwroot/css/app.css --watch" : settings.Tailwindcss
                    ),
                    cancel.Token
                ).Invoke();
        })
        { }
    }
}
