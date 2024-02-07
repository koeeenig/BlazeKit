using BlazeKit.Hydration;
using BlazeKit.Static;

namespace BlazeKit.Website;

/// <summary>
/// A static service collection that is used to build a static site
/// </summary>
public sealed class StaticServiceCollection : IStaticServiceCollection
{
    private readonly Func<IServiceCollection> services;

    /// <summary>
    /// A static service collection that is used to build a static site
    /// </summary>
    public StaticServiceCollection() :this(
        new ServiceCollection()
    )
    { }

    /// <summary>
    /// A static service collection that is used to build a static site
    /// </summary>
    public StaticServiceCollection(IServiceCollection serviceCollection)
    {
        this.services = () => {
            serviceCollection.AddKeyedSingleton(BlogCollection.CollectionName, new BlogCollection());
            serviceCollection.AddKeyedSingleton(NewsCollection.CollectionName, new NewsCollection());
            serviceCollection.AddScoped<DataHydrationContext>();
            return serviceCollection;
        };
    }
    public IServiceCollection Services() => services();
}
