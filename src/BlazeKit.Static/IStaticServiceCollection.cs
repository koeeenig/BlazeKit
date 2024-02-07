using Microsoft.Extensions.DependencyInjection;

namespace BlazeKit.Static;

/// <summary>
/// A static service collection that is used to build a static site
/// </summary>
public interface IStaticServiceCollection
{
    /// <summary>
    /// A static service collection that is used to build a static site
    /// </summary>
    IServiceCollection Services();
}
