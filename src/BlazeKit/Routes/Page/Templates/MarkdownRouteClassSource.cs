﻿using System.Text;

namespace BlazeKit.Routes.Pages.SourceTemplates;

/// <summary>
    /// A generated source code of a route class
    /// </summary>
    public class MarkdownRouteClassSource : Lazy<string>
    {
        /// <summary>
        /// A generated source code of a route class
        /// </summary>
        public MarkdownRouteClassSource(string classNameSpace, string className, string route, string layout, string htmlContent, params string[] parameters) : base(() =>
        {
            var text = new StringBuilder();
            text.AppendLine($"// Auto-generated by BlazeKit");
            text.AppendLine("using Microsoft.AspNetCore.Components;");
            text.AppendLine("using BlazeKit.Abstraction;");
            text.AppendLine($"namespace {classNameSpace};");
            text.AppendLine($"[Route(\"{(route == "" ? "/" : route)}\")]");

            if (!string.IsNullOrEmpty(layout))
            {
                text.AppendLine($"[Layout(typeof({layout}))]");
            }

            if (parameters.Count() > 0)
            {
                text.AppendLine($"public partial class {className} : IComponent {{");
                text.AppendLine("\t// Route Params");
                foreach (var parameter in parameters)
                {
                    text.AppendLine("\t[Parameter]");
                    text.AppendLine($"\tpublic string {parameter} {{ get; set;}}");
                }
                text.AppendLine("\tprivate RenderHandle renderHandle;");
                text.AppendLine("\tvoid IComponent.Attach(RenderHandle renderHandle) => this.renderHandle = renderHandle;");
                text.AppendLine("\tTask IComponent.SetParametersAsync(ParameterView parameters) {");
                text.AppendLine("\t\trenderHandle.Render(builder => builder.AddContent(0,new MarkupString(content)));");
                text.AppendLine("\t\treturn Task.CompletedTask;");
                text.AppendLine("\t}");
                text.AppendLine($"private string content = @\"\"\"{htmlContent}\"\"\";");
                text.AppendLine("}");
            }
            else
            {
                text.AppendLine($"public partial class {className} : IComponent {{");
                text.AppendLine("\tprivate RenderHandle renderHandle;");
                text.AppendLine("\tvoid IComponent.Attach(RenderHandle renderHandle) => this.renderHandle = renderHandle;");
                text.AppendLine("\tTask IComponent.SetParametersAsync(ParameterView parameters) {");
                text.AppendLine("\t\trenderHandle.Render(builder => builder.AddContent(0,new MarkupString(content)));");
                text.AppendLine("\t\treturn Task.CompletedTask;");
                text.AppendLine("\t}");
                text.AppendLine($"private string content = @\"{htmlContent}\";");
                text.AppendLine("}");
            }


            return text.ToString();
        })
        {

        }
    }
