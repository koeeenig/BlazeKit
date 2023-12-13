using BlazeKit.Abstraction;
using System;
using System.Text;

namespace BlazeKit.Layout.SourceTemplates
{
    /// <summary>
    /// A generated source code of a layout class
    /// </summary>
    internal class ErrorLayoutClassSource : Lazy<string>
    {
        /// <summary>
        /// A generated source code of a layout class
        /// </summary>
        public ErrorLayoutClassSource(string classNameSpace, string className, string layout, string baseClass = "LayoutComponentBase") : base(() =>
        {
            var text = new StringBuilder();
            text.AppendLine("using Microsoft.AspNetCore.Components;");
            text.AppendLine("using BlazeKit.Abstraction;");
            text.AppendLine($"namespace {classNameSpace};");

            if (!string.IsNullOrEmpty(layout))
            {
                text.AppendLine($"[Layout(typeof({layout}))]");
            }

            text.AppendLine($"public partial class {className} : {baseClass}, {nameof(IReactiveComponent)} {{");
            text.AppendLine("\tpublic void Update() => InvokeAsync(StateHasChanged);");
            text.AppendLine("}");
            return text.ToString();
        })
        {

        }
    }
}
