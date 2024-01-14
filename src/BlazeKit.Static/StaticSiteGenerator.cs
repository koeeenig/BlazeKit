using System.Reflection;
using BlazeKit.Hydration;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Routing;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.Extensions.DependencyInjection;
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

    public void Build()
    {
        var rootComponent = this.assembly.GetExportedTypes().FirstOrDefault(t => t.Name == "Index");
        if(rootComponent == null)
        {
            throw new Exception($"No root component found name 'Index' in assembly '{assembly.Location}' to build static site.");
        }
        Build(rootComponent);
    }


    public async void Build(Type rootComponent)
    {
        var serviceCollection = new ServiceCollection();

        var routeManager = new StaticNavigationManager();
        serviceCollection.AddLogging();
        serviceCollection.AddSingleton<NavigationManager>(routeManager);
        serviceCollection.AddSingleton<IJSRuntime>(new FkJsRuntime());
        serviceCollection.AddSingleton<INavigationInterception>(new FkNavigationInterception());
        serviceCollection.AddSingleton<IScrollToLocationHash>(new FkScrollToLocationHash());
        serviceCollection.AddSingleton<IErrorBoundaryLogger>(new StaticErrorBoundaryLogger());
        serviceCollection.AddSingleton(new DataHydrationContext());
        foreach(var route in this.routes.Value)
        {
            try
            {
                Console.WriteLine($"Building route: {route}");
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
                var directory = Path.Combine(new List<string>() {this.outputDirectory}.Concat(route.Split('/')).ToArray());
                GeneratePage(directory, html);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Failed to build route: {route} {ex.ToString()}");
                throw;
            }
        }
        // copy wwwroot
        var source = Path.Combine(this.wwwrootContent);
        var destination = Path.Combine(this.outputDirectory);
        CopyDirectory(source, destination);
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
