using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Routing;
namespace Microsoft.AspNetCore.Components.Endpoints;
internal sealed class BkHttpNavigationManager : NavigationManager
{
    // void IHostEnvironmentNavigationManager.Initialize(string baseUri, string uri) => Initialize(baseUri, uri);

    public new void Initialize(string baseUri, string uri)
    {
        base.Initialize(baseUri, uri);
    }

    protected override void NavigateToCore(string uri, NavigationOptions options)
    {
        var absoluteUriString = ToAbsoluteUri(uri).ToString();
        throw new NavigationException(absoluteUriString);
    }
}
