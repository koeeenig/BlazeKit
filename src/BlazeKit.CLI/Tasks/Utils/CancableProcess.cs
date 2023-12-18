using Spectre.Console;
using Yaapii.Atoms;
namespace BlazeKit.CLI.Tasks.Utils;
public sealed class CancableProcess : IFunc<Task>
{
    private readonly IProcess process;
    private readonly CancellationToken cancel;

    public CancableProcess(IProcess process, CancellationToken cancel)
    {
        this.process = process;
        this.cancel = cancel;
    }

    public Task Invoke()
    {
        return Task.Run(async () =>
        {
            var p = process.Run();
            while (!p.HasExited)
            {
                if (cancel.IsCancellationRequested)
                {
                    //AnsiConsole.MarkupLine("[yellow]Stopping process...[/]");
                    p.Kill();
                    break;
                }

                await Task.Delay(50);
            }
        });
    }
}
