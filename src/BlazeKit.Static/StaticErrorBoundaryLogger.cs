using Microsoft.AspNetCore.Components.Web;

namespace BlazeKit.Static;

public class StaticErrorBoundaryLogger : IErrorBoundaryLogger
{
    private readonly Action<Exception> logError;

    public StaticErrorBoundaryLogger() :this((e) => Console.WriteLine(e))
    { }

    public StaticErrorBoundaryLogger(Action<Exception> logError)
    {
        this.logError = logError;
    }
    public ValueTask LogErrorAsync(Exception exception)
    {
        this.logError(exception);
        return ValueTask.CompletedTask;
    }
}
