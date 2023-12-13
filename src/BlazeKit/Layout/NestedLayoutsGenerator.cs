using System.Diagnostics;
using BlazeKit.Layout.SourceTemplates;
using BlazeKit.Utils;
using Microsoft.CodeAnalysis;

namespace BlazeKit.Layout;

[Generator]
public class NestedLayoutsGenerator : IIncrementalGenerator
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
         var layouts = context.AdditionalTextsProvider
                                .Where(file => new IsUnderRoot(file.Path).Value && file.Path.EndsWith("layout.razor",StringComparison.OrdinalIgnoreCase))
                                .Collect();

        // var errorLayouts = context.AdditionalTextsProvider
        //                         .Where(file => new IsUnderRoot(file.Path).Value && file.Path.EndsWith("error.razor",StringComparison.OrdinalIgnoreCase))
        //                         .Collect();

            context.RegisterSourceOutput(layouts.Combine(rootNamespace),(spc, values) => {
                var (layouts, rootNS) = values;

                // var (layouts, rootNS) = layoutsAndNameSpace;

                foreach (var razorFile in layouts)
                {
                        var namespaceSegments = rootNS + "." + new NamespaceSegments(razorFile.Path, root: "routes").Value;
                        var name = new SanititizedNamespace(Path.GetFileName(razorFile.Path).Replace(".razor", "")).Value;
                        var layout = new ClosestLayout(razorFile.Path, msg => Debug.WriteLine(msg), skipSameDirectory: true, root: "routes").Value;
                        var className = "";
                        if (!string.IsNullOrEmpty(layout))
                        {
                            className = $"{rootNS}.{layout}";
                        }
                        var generatedLayoutClass = new LayoutClassSource(namespaceSegments, name, className);
                        spc.AddSource($"{namespaceSegments}.{name}.g.cs", generatedLayoutClass.Value);
                        var desc =
                            new DiagnosticDescriptor(
                                "SG0002",
                                "Found Layout",
                                $"The Layout is '{razorFile.Path}'",
                                "Information",
                                DiagnosticSeverity.Warning,
                                true
                            );
                        spc.ReportDiagnostic(Diagnostic.Create(desc,Location.None));
                }
            });
    }

    private string ErrorLayoutSource(string nameSpace, string layout, string errorComponent)
    {
        return $@"
        using Microsoft.AspNetCore.Components;

using Microsoft.AspNetCore.Components;
using BlazeKit.Abstraction;
namespace {nameSpace};
[Layout(typeof({layout}))]
public partial class ErrorLayout : LayoutComponentBase, IComponent {{
	private RenderHandle renderHandle;
	void IComponent.Attach(RenderHandle renderHandle) => this.renderHandle = renderHandle;
	Task IComponent.SetParametersAsync(ParameterView parameters) {{
		renderHandle.Render(builder => {{
            builder.OpenComponent<global::Microsoft.AspNetCore.Components.Web.ErrorBoundary>(0);
            builder.AddAttribute(1, ""ErrorContent"", new global::Microsoft.AspNetCore.Components.RenderFragment<System.Exception>(context => builder2 =>
            {{
                builder2.OpenComponent<{errorComponent}>(2);
                builder2.CloseComponent();
            }}));
            builder.AddAttribute(3, ""ChildContent"",(global::Microsoft.AspNetCore.Components.RenderFragment)(builder2 => {{
                builder2.AddContent(4, Body);
            }}));
            builder.CloseComponent();
        }});
		return Task.CompletedTask;
	}}
}}
        ";
    }
}
