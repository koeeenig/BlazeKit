using BlazeKit.Routing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace BlazeKit.Tests.Routing
{
    public sealed class PageFromMarkdownClassSourceTests
    {
        [Fact]
        public void GeneratesSourceCode()
        {
            var generatedClass = 
                new PageFromMarkdownClassSource(
                    "My.Test.Class",
                    "Foo",
                    "/foo/bar",
                    "Layout",
                    "<h1 id=\"foobar\">Hello World</h1>"
                ).Value;

            
        }
    }
}
