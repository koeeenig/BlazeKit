using System;
using System.IO;

namespace BlazeKit.Utils
{
    /// <summary>
    /// Checks if the file is under the root folder.
    /// </summary>
    internal sealed class IsUnderRoot : Lazy<bool>
    {
        /// <summary>
        /// Checks if the file is under the root folder.
        /// </summary>
        public IsUnderRoot(string path, string root = "routes") : base(() =>
        {
            return path.ToLower().Contains($"{Path.DirectorySeparatorChar}{root}{Path.DirectorySeparatorChar}") || path.ToLower().Contains($"{Path.AltDirectorySeparatorChar}{root}{Path.AltDirectorySeparatorChar}");
        })
        { }
    }
}
