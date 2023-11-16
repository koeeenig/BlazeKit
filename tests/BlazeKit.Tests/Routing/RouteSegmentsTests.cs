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
        [InlineData(@"Pages/(Getting-Started)/Create-A-Project/Page.razor","Create-A-Project")]
        [InlineData(@"Pages\(Getting-Started)\Create-A-Project\Page.razor", "Create-A-Project")]
        public void IgnoresGroups(string route, string expected)
        {
            var segments = new RouteSegments(route, msg => Debug.WriteLine(msg), "pages").Value;
            Assert.Equal(expected, string.Join("/", segments));
        }
    }
}
