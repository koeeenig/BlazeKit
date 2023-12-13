namespace BlazeKit.Routes
{
    internal class RouteParameters : Lazy<IEnumerable<string>>
    {
        public RouteParameters(IList<string> routeSegments) : base(() =>
            routeSegments.Where(seg => seg.StartsWith("{")).Select(seg => seg.Trim('{', '}'))
        )
        { }
    }
}
