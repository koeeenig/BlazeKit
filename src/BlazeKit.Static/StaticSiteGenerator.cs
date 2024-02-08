using System.Reflection;
using BlazeKit.Hydration;
using BlazeKit.Static.ContentCollections;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Routing;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.JSInterop;

namespace BlazeKit.Static;
public class StaticSiteGenerator
{
    private readonly string outputDirectory;
    private readonly string wwwrootContent;
    private readonly Assembly assembly;
    private readonly Lazy<IEnumerable<string>> routes;

    public StaticSiteGenerator(string outputDirectory, string wwwrootContent, Assembly assembly) :this(
        outputDirectory,
        wwwrootContent,
        () => {
            return assembly
                .GetExportedTypes()
                .Where(t => t.GetCustomAttributes(typeof(RouteAttribute), true).Count() > 0)
                .Select(t =>
                {
                    var route = t.GetCustomAttributes(typeof(RouteAttribute), true).FirstOrDefault() as RouteAttribute;
                    return route!.Template;
                });
        },
        assembly
    )
    { }

    public StaticSiteGenerator(string outputDirectory,string wwwrootContent, IEnumerable<string> routes, Assembly assembly) :  this(
        outputDirectory,
        wwwrootContent,
        () => routes,
        assembly
    )
    { }

    public StaticSiteGenerator(string wwwrootContent, IEnumerable<string> routes, Assembly assembly) : this(
        Path.Combine(".blazekit","build"),
        wwwrootContent,
        () => routes,
        assembly
    )
    { }
    public StaticSiteGenerator(string outputDirectory, string wwwrootContent, Func<IEnumerable<string>> routes, Assembly assembly)
    {
        this.outputDirectory = outputDirectory;
        this.wwwrootContent = wwwrootContent;
        this.assembly = assembly;
        this.routes = new Lazy<IEnumerable<string>>(routes);
    }

    public Task Build()
    {
        var rootComponent = this.assembly.GetExportedTypes().FirstOrDefault(t => t.Name == "Index");
        if(rootComponent == null)
        {
            throw new Exception($"No root component found with name 'Index' in assembly '{assembly.Location}' to build static site.");
        }
        IServiceCollection serviceCollection = new ServiceCollection();
        // find a type which implements the BlazeKit.Static.IStaticServiceCollection interface from the assembly
        var staticServiceCollectionType = this.assembly.GetExportedTypes().FirstOrDefault(t => t.GetInterfaces().Contains(typeof(IStaticServiceCollection)));
        if(staticServiceCollectionType != null)
        {
            // create an instance of the type
            Console.WriteLine($"Using static service collection: {staticServiceCollectionType.FullName}");
            var staticServiceCollection = Activator.CreateInstance(staticServiceCollectionType) as IStaticServiceCollection;
            if(staticServiceCollection == null)
            {
                throw new Exception($"Failed to create instance of type '{staticServiceCollectionType.FullName}' from assembly '{this.assembly.Location}'");
            } else {
                serviceCollection = staticServiceCollection.Services();
            }
        }
        return Build(rootComponent, serviceCollection);
    }


    public Task Build(Type rootComponent, IServiceCollection serviceCollection)
    {
        return Task.Run(async () =>
        {
            // copy wwwroot
            var source = Path.Combine(this.wwwrootContent);
            var destination = Path.Combine(this.outputDirectory);
            Console.WriteLine($"Copying wwwroot from {source} to {destination}");
            CopyDirectory(source, destination);
            // var serviceCollection = new ServiceCollection();

            var routeManager = new StaticNavigationManager();
            serviceCollection.AddLogging();
            serviceCollection.AddSingleton<IHostEnvironment>(new BKitHostEnvironment("Production"));
            serviceCollection.AddSingleton<NavigationManager>(routeManager);
            serviceCollection.AddSingleton<IJSRuntime>(new FkJsRuntime());
            serviceCollection.AddSingleton<INavigationInterception>(new FkNavigationInterception());
            serviceCollection.AddSingleton<IScrollToLocationHash>(new FkScrollToLocationHash());
            serviceCollection.AddSingleton<IErrorBoundaryLogger>(new StaticErrorBoundaryLogger());

            
            //serviceCollection.AddScoped<DataHydrationContext>();
            foreach (var route in this.routes.Value)
            {
                try
                {
                    Console.WriteLine($"Building route: {route}");

                    // check if route has dynamic parameters
                    if(route.Contains("{"))
                    {
                        Console.WriteLine($"Route has dynamic parameters: {route}");
                        // get the route template
                        var routeTemplate = route.Split('/')[0];
                        // get all types which implememnt IContentCollection
                        var t = typeof(ISchema);
                        var contentCollectionTypes =
                             this.assembly.GetExportedTypes()
                                .Where(t => t.GetInterfaces().Contains(typeof(IContentCollection)));

                        // create instaces of the types
                        var contentCollections = contentCollectionTypes.Select(t => Activator.CreateInstance(t) as IContentCollection);
                        // find the content collection which matches the route template
                        var contentCollection = contentCollections.FirstOrDefault(c => c.Name.Equals(routeTemplate, StringComparison.InvariantCultureIgnoreCase));
                        // render each item of the content colltection
                        foreach(var item in contentCollection.Items)
                        {
                            var routeWithParams = contentCollection.Route(item);
                            Console.WriteLine($"Building route for Content Collection '{contentCollection.Name}': {routeWithParams}");
                            Prerender(routeWithParams, routeManager, rootComponent, serviceCollection);
                        }

                        continue;
                    }
                    var spv = serviceCollection.BuildServiceProvider();
                    var scoped = spv.CreateScope();
                    var serviceProvider = scoped.ServiceProvider;

                    // get the type which from this.assembly which has a route parameter which matches the route
                    var shouldPreRender = ShouldBePreRender(route);
                    if(!shouldPreRender)
                    {
                        Console.WriteLine($"Skipping '{route}' for pre-render due to 'prerender = {false}'");
                        continue;
                    }

                    //var route2 = "/loadtest";
                    routeManager.NavigateTo(route, forceLoad: true);
                    //var html =
                    //    await
                    //        new BlazorRenderer(
                    //            new HtmlRenderer(
                    //                serviceCollection.BuildServiceProvider(),
                    //                serviceCollection.BuildServiceProvider()
                    //                    .GetRequiredService<ILoggerFactory>()
                    //            ),
                    //            serviceCollection.BuildServiceProvider()
                    //        )
                    //        .RenderComponent(rootComponent);
                    var renderer =
                        new BlazorRenderer(
                                new HtmlRenderer(
                                    serviceProvider,
                                    serviceProvider
                                        .GetRequiredService<ILoggerFactory>()
                                ),
                                serviceProvider
                            );
                    var html =
                        await renderer.RenderComponent(rootComponent);


                    var directory = Path.Combine(new List<string>() {this.outputDirectory}.Concat(route.Split('/')).ToArray()).ToLower();
                    GeneratePage(directory, html);
                }
                catch (System.Exception ex)
                {
                    Console.WriteLine($"Failed to build route: {route} {ex.ToString()}");
                    throw;
                }
            }
            return Task.CompletedTask;
        });
    }

    private async void Prerender(string route, NavigationManager routeManager, Type rootComponent, IServiceCollection serviceCollection) {
            routeManager.NavigateTo(route, forceLoad: true);
            var html =
                await
                    new BlazorRenderer(
                        new HtmlRenderer(
                            serviceCollection.BuildServiceProvider(),
                            serviceCollection.BuildServiceProvider()
                                .GetRequiredService<ILoggerFactory>()
                        ),
                        serviceCollection.BuildServiceProvider()
                    )
                    .RenderComponent(rootComponent);
            var directory = Path.Combine(new List<string>() {this.outputDirectory}.Concat(route.Split('/')).ToArray()).ToLower();
            GeneratePage(directory, html);
    }

    private bool ShouldBePreRender(string route, bool fallback = true)
    {
        var result = fallback;
        var page =
            this.assembly
                .GetExportedTypes()
                .Where(t => t.GetCustomAttributes(typeof(RouteAttribute), true).Count() > 0)
                .Where(t =>
                {
                    var routeValue = t.GetCustomAttributes(typeof(RouteAttribute), true).FirstOrDefault() as RouteAttribute;

                    return routeValue.Template.Equals(route, StringComparison.InvariantCultureIgnoreCase);
                })
                .FirstOrDefault();
        if (page != null)
        {
            var prerender = page.GetField("prerender", BindingFlags.Static | BindingFlags.NonPublic);
            if(prerender != null)
            {
                var shouldPreRender = (bool)prerender.GetValue(null);
                result = shouldPreRender;
            }
        }
        return result;
    }

    private void GeneratePage(string directory, string htmlContent)
    {
        CreateIfAbsent(directory);
        File.WriteAllText(Path.Combine(directory, "index.html"), htmlContent);
    }

    private void CreateIfAbsent(string directory)
    {
        if(!Directory.Exists(directory))
        {
            Directory.CreateDirectory(directory);
        }
    }
    // copies all files of a given directory recursivly to a target directory
    private void CopyDirectory(string source, string destination)
    {
        // get all files of the source directory
        var files = Directory.GetFiles(source);
        // copy all files to the destination directory
        foreach(var file in files)
        {
            var fileName = Path.GetFileName(file);
            var destinationFile = Path.Combine(destination, fileName);
            new FileInfo(destinationFile).Directory.Create();
            File.Copy(file, destinationFile, overwrite: true);
        }
        // get all directories of the source directory
        var directories = Directory.GetDirectories(source);
        // copy all directories to the destination directory
        foreach(var directory in directories)
        {
            var directoryName = Path.GetFileName(directory);
            var destinationDirectory = Path.Combine(destination, directoryName);
            CopyDirectory(directory, destinationDirectory);
        }
    }
}
