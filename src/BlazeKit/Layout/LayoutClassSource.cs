using BlazeKit.Abstraction;
using System;
using System.Text;

namespace BlazeKit
{
    /// <summary>
    /// A generated source code of a layout class
    /// </summary>
    internal class LayoutClassSource : Lazy<string>
    {
        /// <summary>
        /// A generated source code of a layout class
        /// </summary>
        public LayoutClassSource(string classNameSpace, string className, string layout) : base(() =>
        {
            var text = new StringBuilder();
            text.AppendLine("using Microsoft.AspNetCore.Components;");
            text.AppendLine("using BlazeKit.Abstraction;");
            text.AppendLine($"namespace {classNameSpace};");

            if (!string.IsNullOrEmpty(layout))
            {
                text.AppendLine($"[Layout(typeof({layout}))]");
            }

            text.AppendLine($"public partial class {className} : LayoutComponentBase, {nameof(IReactiveComponent)} {{");
            text.AppendLine("\tpublic void Update() => InvokeAsync(StateHasChanged);");
            text.AppendLine("}");
            return text.ToString();
        })
        {

        }
    }
}
