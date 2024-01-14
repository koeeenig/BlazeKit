using Microsoft.AspNetCore.Components.Routing;

namespace BlazeKit.Static;

public sealed class FkNavigationInterception : INavigationInterception
{
    public Task EnableNavigationInterceptionAsync()
    {
        return Task.CompletedTask;
    }
}

public class FkScrollToLocationHash : IScrollToLocationHash
{
    public Task RefreshScrollPositionForHash(string locationAbsolute)
    {
        return Task.CompletedTask;
    }
}
