using System;
using System.Linq;
using System.Text.RegularExpressions;

namespace BlazeKit.CLI
{
    /// <summary>
    /// Sanitizes a namespace string to be a valid C# namespace.
    /// </summary>
    public sealed class SanititizedNamespace : Lazy<string>
    {
        /// <summary>
        /// Sanitizes a namespace string to be a valid C# namespace.
        /// </summary>
        public SanititizedNamespace(string namespaceString) : base(() =>
        {
            string sanitized = Regex.Replace(namespaceString, @"[^.a-zA-Z0-9_]", "_");
            var match = Regex.Match(sanitized, @"^\d+");
            if(match.Success)
            {
                sanitized = sanitized.Replace(match.Value, new string(Enumerable.Repeat('_',match.Length).ToArray()));
            }
            return sanitized;
        })
        { }

    }
}
