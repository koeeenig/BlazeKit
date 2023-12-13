using System;
using System.IO;
using System.Text.RegularExpressions;

namespace BlazeKit.Layout
{
    /// <summary>
    /// Checks if the file is a layout file
    /// </summary>
    internal sealed class IsLayout : Lazy<bool>
    {
        /// <summary>
        /// Checks if the file is a layout file
        /// </summary>
        public IsLayout(string path) : this(new FileInfo(path))
        { }
        public IsLayout(FileInfo file) : base(() =>
        {
            return Regex.IsMatch(file.Name, @"layout\@*[\(\)\[\]A-Za-z]*.razor", RegexOptions.IgnoreCase);
        })
        { }
    }
}
