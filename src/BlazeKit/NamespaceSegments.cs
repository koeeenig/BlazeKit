using System;
using System.Linq;

namespace BlazeKit
{
    internal class NamespaceSegments : Lazy<string>
    {
        public NamespaceSegments(string path, string root) : base(() =>
        {
            var structure = path.Substring(path.ToLower().IndexOf(root));
            var segments = structure.Split(new char[] { System.IO.Path.DirectorySeparatorChar }, StringSplitOptions.RemoveEmptyEntries).Reverse().Skip(1).Reverse();//.Select(s => new SanititizedNamespace(s).Value);
            return new SanititizedNamespace(string.Join(".", segments)).Value;
        })
        { }
    }
}
