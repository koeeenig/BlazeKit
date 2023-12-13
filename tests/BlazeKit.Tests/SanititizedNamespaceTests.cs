using BlazeKit.Utils;

namespace BlazeKit.Tests
{
    public class SanititizedNamespaceTests
    {
        [Theory]
        [InlineData("Fancy.[Param].foobar","Fancy._Param_.foobar")]
        [InlineData("123Fancy.[Param].foobar", "___Fancy._Param_.foobar")]
        public void Sanatizes(string input, string expected)
        {
            Assert.Equal(expected, new SanititizedNamespace(input).Value);
        }
    }
}
