using System;
using System.Linq;

namespace BlazeKit.Utils
{
    internal class NamespaceSegments : Lazy<string>
    {
        public NamespaceSegments(string path, string root) : base(() =>
        {
            var result = new SanititizedNamespace(root).Value;
            if(path.ToLower().IndexOf(root) >= 0) {
                var structure = path.Substring(path.ToLower().IndexOf(root));
                var segments = structure.Split(new char[] { System.IO.Path.DirectorySeparatorChar }, StringSplitOptions.RemoveEmptyEntries).Reverse().Skip(1).Reverse();
                result = new SanititizedNamespace(string.Join(".", segments)).Value;
            }
            return result;
        })
        { }
    }
}
