# 🪧 File-based Routing
The routing in BlazeKit is based on the filesystem. Each route is represented by a folder which contains a `Page.razor` or a `Page.md` file.
The folder structure is used to define the route of the page. For example the following folder structure:
```
Routes/
├ About/
│ └ Page.razor
├ Contact/
│ └ Page.md
└ Page.razor
```
will result in the following routes:
- `/`
- `/about`
- `/contact`

## Route Parameters
Route parameters can be defined by adding a folder with the name of the parameter surrounded by square brakets <strong>[Param]</strong>.
For example the following folder structure:
```
Routes/
├ About/
│ └ Page.razor
├ Project/
│ └ [Id]/
│   └ Page.razor
└ Page.razor
```
will result in the following routes:
- `/`
- `/about`
- `/project/{id}`

BlazeKit will generate a class with the name of the parameter which can be used to access the parameter value.
In the above example the `Id` parameter can be accessed in the `Routes/Project/[Id]/Page.razor` file by `Id` property.
```html
<h1>Project Id: @Id</h1>
```
# API Routes
<blockquote class="callout">
<div>☝️</div>
    <div>This Feature is <strong>NOT</strong> available in <strong>WebAssembly</strong> projects</div>
</blockquote>

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
Blazor in SSR mode maps an `Get-API-Route` for each component defining a route with `@page`. BlazeKit uses a file-based router and applies these `@page` attribute at compile time. Therefore a custom API Route representing a `GetRequest` cannot be co-located in the folder containing the `Page.razor file.


