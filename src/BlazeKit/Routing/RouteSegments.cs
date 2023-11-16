using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace BlazeKit
{
    public sealed class RouteSegments : Lazy<List<string>>
    {
        public RouteSegments(string path, Action<string> log, string root = "pages", string paramRegex = @"\[\w+\]") : base(() =>
        {
            var structure = path.Substring(path.ToLower().IndexOf(root) + root.Length);
            var segments =
                structure.Split(new char[] { System.IO.Path.DirectorySeparatorChar, System.IO.Path.AltDirectorySeparatorChar }, StringSplitOptions.RemoveEmptyEntries)
                .Reverse() // reverse
                .Skip(1) // skip Page.razor
                .Reverse(); // reverse again

            var routeSegments = new List<string>();
            foreach (var segment in segments)
            {
                if(Regex.IsMatch(segment, @"^\(.*\)$", RegexOptions.IgnoreCase))
                {
                    log($"Found a grouping segment '{segment}' which will not be part of the route");
                } else
                {
                    log($"Checking Segment '{segment}' for route paramaters");
                    if (Regex.IsMatch(segment, paramRegex, RegexOptions.IgnoreCase))
                    {
                        var modified = $"{{{segment.Substring(1, segment.Length - 2)}}}";
                        log($"Found route parameter '{modified}'");
                        routeSegments.Add(modified);
                    }
                    else if (!Regex.IsMatch(segment, paramRegex, RegexOptions.IgnoreCase))
                    {
                        routeSegments.Add(segment);
                    }
                }
            }

            return new List<string>(routeSegments);
        })
        { }
    }
}
