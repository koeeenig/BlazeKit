using BlazeKit.Layout;
using BlazeKit.Routes.Pages.SourceTemplates;
using BlazeKit.Utils;
using Microsoft.CodeAnalysis;
using System.Diagnostics;
namespace BlazeKit.Routes.Pages
{
    [Generator]
    public class PageRoutesGenerator : IIncrementalGenerator
    {
        public PageRoutesGenerator()
        {
            //Debugger.Launch();
        }
        public void Initialize(IncrementalGeneratorInitializationContext context)
        {
              var rootNamespace =
                context.AnalyzerConfigOptionsProvider
                        .Select((options, _) =>
                        {
                            if(!options.GlobalOptions.TryGetValue("build_property.RootNamespace", out var rootNS)) {
                                rootNS = "";
                            }
                            return rootNS;
                        });

           var pageRoutes = context.AdditionalTextsProvider
                                .Where(file => new IsUnderRoot(file.Path).Value && file.Path.EndsWith("page.razor",StringComparison.OrdinalIgnoreCase))
                                .Collect();
            context.RegisterSourceOutput(pageRoutes.Combine(rootNamespace),(spc, values) =>
            {
                var (routes, rootNS) = values.ToTuple();
                foreach (var razorFile in routes)
                {
                    var namespaceSegments = rootNS + "." + new NamespaceSegments(razorFile.Path, root: "routes").Value;
                    var name = new SanititizedNamespace(Path.GetFileName(razorFile.Path).Replace(".razor", "")).Value;
                    var routeSegments = new RouteSegments(razorFile.Path, (msg) => Debug.WriteLine(msg), root: "routes").Value;
                    var combinedRoute = string.Join("/", routeSegments);
                    // route prameters are enclosed in curly braces
                    var parameters = new RouteParameters(routeSegments);
                    // find the namespace of the razor file
                    // the namespace is defined by the file path starting at the root "pages" folder
                    // and ending with the last folder were the razor file is located
                    var layout = new ClosestLayout(razorFile.Path, msg => Debug.WriteLine(msg), skipSameDirectory: false, root: "routes").Value;
                    var className = "";
                    if(!string.IsNullOrEmpty(layout)) {
                        className = $"{rootNS}.{layout}";
                    }
                    var generatedRouteClass = new RouteClassSource(namespaceSegments, name, combinedRoute, className, parameters.Value.ToArray());
                    spc.AddSource($"{namespaceSegments}.{name}.g.cs", generatedRouteClass.Value);
                    var desc =
                        new DiagnosticDescriptor(
                            "SG0001",
                            "Found Page Route",
                            $"The Page Route is '{razorFile.Path}'",
                            "Information",
                            DiagnosticSeverity.Warning,
                            true
                        );
                    spc.ReportDiagnostic(Diagnostic.Create(desc,Location.None));
                }
            });
        }
    }
}
