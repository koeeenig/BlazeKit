using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BlazeKit
{
    internal class RouteParameters : Lazy<IEnumerable<string>>
    {
        public RouteParameters(IList<string> routeSegments) : base(() =>
            routeSegments.Where(seg => seg.StartsWith("{")).Select(seg => seg.Trim('{', '}'))
        )
        { }
    }
}
