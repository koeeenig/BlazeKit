---
title: Routing
category: Core Concepts
draft: false
slug: routing
---
# Routing
Routing is a fundamental concept in web apps. It is the mechanism by which users are directed to different parts of your app based on the URL they request.

In a web application, routing plays a crucial role in defining the user experience. It allows users to navigate through the application and access its various features. Without routing, every request would lead to the same place, making the application essentially a single page.

Moreover, routing is important for SEO (Search Engine Optimization). Well-structured URLs and proper routing can help improve the visibility of your web application in search engine results.

# Page Routes
The routing in BlazeKit is based on the filesystem. Each route is represented by a folder which contains a `Page.razor` or a `Page.md` file.
In the context of BlazeKit, routing is file-based. This means that the structure of the routes is determined by the filesystem, making it intuitive and easy to manage, even for large applications.
The folder structure is used to define the route of the page. For example the following folder structure:
```none
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
```none
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
# Layouts
**BlazeKit** uses a file-based layout convention which is inspired by [SvelteKit](https/kit.svelte.dev). Again a huge shoutout to the svelte Team for the inspiration.

## Layout nesting
Similar to the file-based routing, a layout can be defined in a folder by adding `Layout.razor` file.
This file **needs to inherit** from **`LayoutComponentBase`**
```razor
@* Layout.razor file *@
@inherits LayoutComponentBase
@Body
```
A layout will inherit from the closest layout found up the folder tree. In this example, the About/Page.razor file will inherit the Layout from `About/Layout.razor`.  The `About/Layout.razor` file will inherit the layout from the Layout file at the root of the Routes folder which is `Routes/Layout.razor`.


```none
Routes/
│ About/
│ ├ Page.razor
│ └ Layout.razor
├ Page.razor
└ Layout.razor
```
## (Group)
Perhaps you have some routes that are 'App' routes that should have one layout (e.g. /dashboard or /item), and others that are 'Marketing' routes that should have a different layout (/about or /testimonials). We can group these routes with a directory whose name is wrapped in parentheses — unlike normal directories, (App) and (Marketing) do not affect the URL pathname of the routes inside them:
```none
Routes/
│ (App)/
│ ├ Dashboard/Page.razor
│ ├ Item/Page.razor
│ └ Layout.razor
│ (Marketing)/
│ ├ About/Page.razor
│ ├ Testimonials/Page.razor
│ └ Layout.razor
├ Admin/Page.razor
└ Layout.razor
```

## Breaking out of layouts
The root layout applies to every page of your app. If you want some pages to have a different layout hierarchy than the rest, then you can put your entire app inside one or more groups except the routes that should not inherit the common layouts.

In the example above, the /Admin route does not inherit either the (App) or (Marketing) layouts.

### Page@
Pages can break out of the current layout hierarchy on a route-by-route basis. Suppose we have an /Item/[id]/Embed route inside the (App) group from the previous example:
```none
Routes/
├ (App)/
│ ├ Item/
│ │ ├ [Id]/
│ │ │ ├ Embed/
│ │ │ │ └ Page.razor
│ │ │ └ Layout.razor
│ │ └ Layout.razor
│ └ Layout.razor
└ Layout.razor
```
Ordinarily, this would inherit the root layout, the **(App) layout**, the **item layout** and the **[Id] layout**. We can reset to one of those layouts by appending @ followed by the segment name — or, for the root layout, the empty string. In this example, we can choose from the following options:

- Page@[Id].razor - inherits from Routes/(App)/Item/[id]/Layout.razor
- Page@Item.razor - inherits from Routes/(App)/Item/Layout.razor
- Page@(App).razor - inherits from Routes/(App)/Layout.razor
- Page@.razor - inherits from Routes/Layout.razor

```none
Routes/
├ (App)/
│ ├ Item/
│ │ ├ [Id]/
│ │ │ ├ Embed/
│ │ │ │ └ Page@(App).razor
│ │ │ └ Layout.razor
│ │ └ Layout.razor
│ └ Layout.razor
└ Layout.razor
```
### Layout@

Like pages, layouts can themselves break out of their parent layout hierarchy, using the same technique. For example, a Layout@.razor component would reset the hierarchy for all its child routes.
```none
Routes/
├ (App)/
│ ├ Item/
│ │ ├ [Id]/
│ │ │ ├ Embed/
│ │ │ │ └ Page.razor  // uses (App)/Item/[Id]/Layout.razor
│ │ │ ├ Layout.razor  // inherits from (App)/Item/Layout@.razor
│ │ │ └ Page.razor    // uses (App)/Item/Layout@.razor
│ │ └ Layout@.razor   // inherits from root layout, skipping (App)/Layout.razor
│ └ Layout.razor
└ Layout.razor
```

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

public class Server : IGetRequest
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
