using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlazeKit.Tests.Routing
{
    public sealed class RouteSegmentsTests
    {
        [Theory]
        [InlineData("Create-A-Project","Pages","(Getting-Started)","Create-A-Project","Page.razor")]
        public void IgnoresGroups(string expected,params string[] routeSegments)
        {
            var segments = new RouteSegments(Path.Combine(routeSegments), msg => Debug.WriteLine(msg), "pages").Value;
            Assert.Equal(expected, string.Join("/", segments));
        }
    }
}
