using Microsoft.AspNetCore.Components;

namespace BlazeKit.Static;
public sealed class StaticNavigationManager : NavigationManager
{
    private readonly string baseUri;
    private readonly string uri;

    public StaticNavigationManager() :this(
        "https://blazekit.static/"
    )
    { }
    public StaticNavigationManager(string baseUri) :this(
        baseUri,
        baseUri
    )
    { }
    public StaticNavigationManager(string baseUri, string uri) : base()
    {
        this.baseUri = baseUri;
        this.uri = uri;
    }
    protected override void EnsureInitialized()
    {
        base.Initialize(baseUri, baseUri);
    }

    protected override void NavigateToCore(string uri, bool forceLoad)
    {
        this.Uri = this.ToAbsoluteUri(uri).ToString();
    }
}
