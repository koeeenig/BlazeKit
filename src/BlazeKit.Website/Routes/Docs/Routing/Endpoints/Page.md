# API Routes

> This Feature is <strong>NOT</strong> available in <strong>WebAssembly</strong> projects

As well as pages you can define routes with a `Server.cs` file (sometimes referred to as an 'API route' or an 'endpoint'), which gives you full control over the response. In the `Server.cs` you create a class which implements one ore more of the following interfaces:
- `IGetRequest`
- `IPostRequest`
- `IPutRequest`
- `IPatchRequest`
- `IDeleteRequest`

Each interface implementation will hande the corresponding HTTP method. A implementation for an api route handling a `GET` request looks like this:

```csharp
using BlazeKit.Abstraction;
namespace TestApp;

public class Server : IGetRequest, IPostRequest
{
    public Delegate Get()
    {
        return () => {
            return Results.Text("Hello World!");
        };
    }
}
```
Last we have to add the API routes to the application which is usually done in the `Program.cs` file.
```csharp
// Program.cs
...
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddRazorComponents();
...
// 👇 This adds the required services to the DI container
builder.Services.AddBlazeKitApiRoutes();
...
app.MapRazorComponents<App>();
// 👇 This maps the routes with the given http methods
app.MapBlazeKitApiRoutes();
app.Run();
```


Like pages, api routes support route parameters.Route parameters can be defined by adding a folder with the name of the parameter surrounded by square brakets [Param].
```
Routes/
├ About/
│ └ Page.razor
├ Project/
│ └ [Id]/
│   └ Server.cs
└ Page.razor
```
This will result in a route `/project/{id}` and the `Server.cs` file might look likes this:

```csharp
using BlazeKit.Abstraction;
namespace TestApp;

public class Server : IGetRequest
{
    public Delegate Get()
    {
        // add the name of the route parameter as method argument
        return (string id) => {
            return Results.Text($"Hello World from Project with ID {id}!");
        };
    }
}
```

BlazeKit uses **Minimal API** for defining API routes. For further informations and example check out the [offical docs](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis/parameter-binding?view=aspnetcore-8.0).


## Known Issues
Blazor in SSR mode maps an `Get-API-Route` for each component defining a route with `@page`. BlazeKit uses a file-based router and applies these `@page` attribute at compile time. Therefore a custom API Route representing a `GetRequest` cannot be co-located in the folder containing the `Page.razor` file.
