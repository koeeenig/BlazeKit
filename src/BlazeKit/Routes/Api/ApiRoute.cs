namespace BlazeKit.Routes.Api;
internal class ApiRoute
{
    public ApiRoute(string httpMethod, string route, string className)
    {
        HttpMethod = httpMethod;
        Route = route;
        ClassName = className;
    }

    public string HttpMethod { get; }
    public string Route { get; }
    public string ClassName { get; }
}
