using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using BlazeKit.Routes.Pages.SourceTemplates;

namespace BlazeKit.Tests.Routing
{
    public sealed class MarkdownRouteClassSourceTests
    {
        [Fact]
        public void GeneratesSourceCode()
        {
            var generatedClass =
                new MarkdownRouteClassSource(
                    "My.Test.Class",
                    "Foo",
                    "/foo/bar",
                    "Layout",
                    "<h1 id=\"foobar\">Hello World</h1>"
                ).Value;


        }
    }
}
