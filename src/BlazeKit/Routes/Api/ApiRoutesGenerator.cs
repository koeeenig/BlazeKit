using BlazeKit.Utils;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System.Diagnostics;
using System.Text;
namespace BlazeKit.Routes.Api
{
    [Generator]
    public class ApiRoutesGenerator : IIncrementalGenerator
    {
        public ApiRoutesGenerator()
        {
            // Debugger.Launch();
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

            var apiRoutes =
                context.SyntaxProvider.CreateSyntaxProvider<IEnumerable<ApiRoute>>(
                    predicate: (s,_) => IsApiRoute(s) && new IsUnderRoot(s.SyntaxTree.FilePath,"routes").Value,
                    transform: (ctx, _) => GetRouteDefinition(ctx)
                ).Where(static m => m is not null)!;


            context.RegisterSourceOutput(apiRoutes.Collect(), (spc,routes) =>
            {
                var hasApiRoutes = false;
                // load template
                var tpl = Template();
                var diString = new StringBuilder();
                var mapString = new StringBuilder();
                foreach (var route in routes)
                {
                    if(route.Count() == 0)
                    {
                        var desc =
                            new DiagnosticDescriptor(
                                "SG0001",
                                "No Route Handler Method Found",
                                "The Rounter Handler is not correctly defined.",
                                "Warning",
                                DiagnosticSeverity.Warning,
                                true
                            );
                        spc.ReportDiagnostic(Diagnostic.Create(desc,Location.None));
                    } else {
                        hasApiRoutes = true;
                        foreach(var method in route)
                        {
                            diString.AppendLine($"services.AddTransient<{method.ClassName}>();");
                            mapString.AppendLine($"endpoints.Map{method.HttpMethod}(\"{method.Route}\", new {method.ClassName}().{method.HttpMethod}());");
                        }
                    }
                }

                if(hasApiRoutes) {
                    tpl =
                        tpl
                        .Replace("##BLAZEKIT_DI_API_ROUTES##", diString.ToString())
                        .Replace("##BLAZEKIT_MAP_API_ROUTES##", mapString.ToString());

                    spc.AddSource("BlazeKitEndpointsBuilderExtensions.g.cs", tpl);
                }
            });
        }
        private bool IsApiRoute(SyntaxNode node)
        {
            var result = false;

            if(node is ClassDeclarationSyntax)
            {
                result = ImplementsInterface((node as ClassDeclarationSyntax)!, "IGetRequest", "IPostRequest", "IDeleteRequest") && node.SyntaxTree.FilePath.EndsWith("server.cs",StringComparison.InvariantCultureIgnoreCase);
            }

            return result;
        }

        private bool ImplementsInterface(ClassDeclarationSyntax classDeclaration, params string[] interfaceNames)
        {
            var result = false;

            if(classDeclaration.BaseList is not null)
            {
                var baseTypes = classDeclaration.BaseList.Types.Select(t => t.ToFullString().Trim(new char[] { '\r', '\n',' ' }));
                // if (baseTypes.Intersect(interfaceNames).Count() > 0)
                if (baseTypes.Any(t => interfaceNames.Any(i => t.EndsWith(i, StringComparison.InvariantCultureIgnoreCase))))
                {
                    result = true;
                }
            }

            return result;
        }

        private IEnumerable<ApiRoute> GetRouteDefinition(GeneratorSyntaxContext context)
        {
            var routeSegments =
                new RouteSegments(
                    context.Node.SyntaxTree.FilePath,
                    msg => Debug.WriteLine(msg)
                );
            var result = new List<ApiRoute>();

            var classDeclaration = context.Node as ClassDeclarationSyntax;

            var typeSymbol = context.SemanticModel.GetDeclaredSymbol(context.Node);
            if(typeSymbol != null)
            {
                var fullName = typeSymbol.ToDisplayString(SymbolDisplayFormat.FullyQualifiedFormat);
                if(ImplementsInterface(classDeclaration!,"IGetRequest"))
                {
                    result.Add(new ApiRoute("Get", string.Join("/", routeSegments.Value), fullName));
                }

                if(ImplementsInterface(classDeclaration!, "IPostRequest"))
                {
                    result.Add(new ApiRoute("Post", string.Join("/", routeSegments.Value), fullName));
                }

                if(ImplementsInterface(classDeclaration!, "IDeleteRequest"))
                {
                    result.Add(new ApiRoute("Delete", string.Join("/", routeSegments.Value), fullName));
                }

                if(ImplementsInterface(classDeclaration!, "IPatchRequest"))
                {
                    result.Add(new ApiRoute("Patch", string.Join("/", routeSegments.Value), fullName));
                }

                if(ImplementsInterface(classDeclaration!, "IPutRequest"))
                {
                    result.Add(new ApiRoute("Put", string.Join("/", routeSegments.Value), fullName));
                }
            }
            return result;
        }


        private string Template()
        {
            return @"
public static class BlazeKitEndpointsBuilderExtensions
{
    public static void AddBlazeKitApiRoutes(this IServiceCollection services)
    {
        ##BLAZEKIT_DI_API_ROUTES##
    }

    public static void MapBlazeKitApiRoutes(this IEndpointRouteBuilder endpoints)
    {
        ##BLAZEKIT_MAP_API_ROUTES##
    }
}
";
        }
    }
}
