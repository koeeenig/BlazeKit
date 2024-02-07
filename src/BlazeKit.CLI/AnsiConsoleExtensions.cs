using Spectre.Console;

namespace BlazeKit.CLI;

public static class AnsiConsoleExtensions
{
    [System.Diagnostics.Conditional("DEBUG")]
    public static void Debug(this IAnsiConsole console, string message)
    {
        console.MarkupLine($"[bold yellow on blue] DEBUG: {message.EscapeMarkup()}[/]");
    }
}
