using System.Diagnostics;
using BlazeKit.Layout;
using BlazeKit.Routes.Pages.SourceTemplates;
using BlazeKit.Utils;
using Markdig;
using Microsoft.CodeAnalysis;

namespace BlazeKit.Routes.Pages;

[Generator]
public class MarkdownRoutesGenerator : IIncrementalGenerator
{
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

        var markdownRoutes = context.AdditionalTextsProvider
                                .Where(file => new IsUnderRoot(file.Path).Value && file.Path.EndsWith("page.md",StringComparison.OrdinalIgnoreCase))
                                .Collect();


            context.RegisterSourceOutput(markdownRoutes.Combine(rootNamespace), (spc,values) =>
            {
                var (markdownFiles, rootNS) = values.ToTuple();
                  var desc =
                        new DiagnosticDescriptor(
                            "SG0004",
                            "Creating Markdown Routes",
                            $"Found '{markdownFiles.Count()}' Markdown Routes",
                            "Information",
                            DiagnosticSeverity.Warning,
                            true
                        );
                    spc.ReportDiagnostic(Diagnostic.Create(desc,Location.None));


                foreach (var markdownFile in markdownFiles)
                {
                    var content = markdownFile.GetText()?.ToString();
                    var htmlContent = Markdig.Markdown.ToHtml(content ?? "", new MarkdownPipelineBuilder().UseAdvancedExtensions().Build());
                    var namespaceSegments = rootNS + "." + new NamespaceSegments(markdownFile.Path, root: "routes").Value;
                    var name = new SanititizedNamespace(Path.GetFileName(markdownFile.Path).Replace(".md", "")).Value;
                    var routeSegments = new RouteSegments(markdownFile.Path, (msg) => Debug.WriteLine(msg), root: "routes").Value;
                    var combinedRoute = string.Join("/", routeSegments);
                    // route prameters are enclosed in curly braces
                    var parameters = new RouteParameters(routeSegments);
                    // find the namespace of the razor file
                    // the namespace is defined by the file path starting at the root "pages" folder
                    // and ending with the last folder were the razor file is located
                    var layout = new ClosestLayout(markdownFile.Path, msg => Debug.WriteLine(msg), skipSameDirectory: false, root: "routes").Value;
                    var className = "";
                    if(!string.IsNullOrEmpty(layout)) {
                        className = $"{rootNS}.{layout}";
                    }
                    var generatedRouteClass = new MarkdownRouteClassSource(namespaceSegments, name, combinedRoute, className,htmlContent.Replace("\"", "\"\""), parameters.Value.ToArray());
                    spc.AddSource($"{namespaceSegments}.{name}.g.cs", generatedRouteClass.Value);

                    spc.ReportDiagnostic(Diagnostic.Create(
                        new DiagnosticDescriptor(
                            "SG0003",
                            "Found Markdown Page Route",
                            $"The Markdown Page Route is '{markdownFile.Path}'",
                            "Information",
                            DiagnosticSeverity.Warning,
                            true
                        )
                        ,Location.None)
                    );
                }
            });
    }
}
