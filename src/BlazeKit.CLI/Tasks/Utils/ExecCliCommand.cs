using System.Diagnostics;
using Yaapii.Atoms;
using Yaapii.Atoms.Scalar;

namespace BlazeKit.CLI.Tasks.Utils;

public sealed class ExecCliCommand : IProcess
{
    private readonly IScalar<Process> process;

    public ExecCliCommand(string command, Action<string> output, params string[] arguments) : this(
        command,
        output,
        startInfo => { },
        arguments
    )
    { }

    public ExecCliCommand(string command, Action<string> output, Action<ProcessStartInfo> configure, params string[] arguments)
    {
        process = ScalarOf.New(() =>
        {
            var process =
                   new Process
                   {
                       StartInfo =
                       {
                            FileName = command,
                            Arguments = string.Join(" ", arguments),
                            RedirectStandardOutput = true,
                            RedirectStandardError = true,
                            RedirectStandardInput = true,
                            UseShellExecute = false,
                            CreateNoWindow = true,
                            WorkingDirectory = Directory.GetCurrentDirectory()
                       },
                       EnableRaisingEvents = true
                   };
            configure(process.StartInfo);
            process.OutputDataReceived += (sender, args) =>
            {
                if (args.Data is not null)
                {
                    output(args.Data);
                }
            };
            process.ErrorDataReceived += (sender, args) =>
            {
                if (args.Data is not null)
                {
                    output(args.Data);
                }
            };

            process.Start();
            process.BeginOutputReadLine();
            process.BeginErrorReadLine();
            return process;
        });

    }

    public Process Run()
    {
        return process.Value();
    }
}
