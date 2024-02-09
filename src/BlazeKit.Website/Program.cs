// See https://aka.ms/new-console-template for more information
using BlazeKit.Static;
using BlazeKit.Tools;
using BlazeKit.Website;


if (args.Count() > 0 && args[0] == "ssg") {
    Console.WriteLine("Building Static Site");

    if(args.Count() < 2) {
        Console.WriteLine("SSG Error: No output path provided");
        return;
    }
    Console.WriteLine($"SSG Output: {args[1]}");
    await
        new BlazeKit.Static.StaticSiteGenerator(
            args[1],
            Path.Combine(".blazekit","build","tmp","wwwroot"),
            typeof(BlazeKit.Website.Index).Assembly
        ).Build();
    Console.WriteLine("Static Site Built");
    return;
}


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<IDevTools>(_ => new DevToolsState());
// call .Value to add the servies to the collection
new StaticServiceCollection(builder.Services).Services();
builder.Services.AddAntiforgery();
// 👇 This adds the required services to the DI container
// builder.Services.AddBlazeKitApiRoutes();

var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseWebAssemblyDebugging();
}
else
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
app.UseBlazorFrameworkFiles();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseAntiforgery();

// We also need to get the routes which will be build from conten collections.
// To get the routes from content collections, use reflection to get all types which implement IContentCollection and get the routes from the collection.
// We can do better in route retrival by using a Source Generator to generate a class which knows all routes present in the app.
var routes =
    typeof(Program).Assembly
                .GetExportedTypes()
                .Where(t => t.GetCustomAttributes(typeof(Microsoft.AspNetCore.Components.RouteAttribute), true).Count() > 0)
                .Select(t =>
                {
                    var route = t.GetCustomAttributes(typeof(Microsoft.AspNetCore.Components.RouteAttribute), true).FirstOrDefault() as Microsoft.AspNetCore.Components.RouteAttribute;
                    return $"/{route!.Template.ToLower().TrimStart('/')}";
                });

//app.UseBlazeKit();

// 👇 This maps the routes with the given http methods
// app.MapBlazeKitApiRoutes();

app.Use(async (HttpContext ctx, RequestDelegate next) =>
{
    var processed = false;
    var isPageRoute = routes.Contains(ctx.Request.Path.ToString());
    // Add a check if the requested route exists for this app.
    // A Source Generator should genérate a class which knows all routes present in the app.
    // We than can distict between api routes (endpoints) and page routes.
    // This might enbale co-locating the api routes with page routes
    if(!isPageRoute)
    {
        await next(ctx);
        if(ctx.Response.ContentLength > 0)
        {
            processed = true;
        }
    }

    // if the routes is processed we stop here
    if(processed)
    {
        return;
    }

    var sc = new ServiceCollection();
    sc.AddSingleton<HttpContext>(ctx);
    new StaticServiceCollection(sc).Services();


    var html = await new PageRenderer(typeof(BlazeKit.Website.Index), sc).Render(ctx.Request.Path);
    ctx.Response.Headers.Add("Content-Type", "text/html");
    ctx.Response.Headers.Add("Blazor-Enhanced-Nav", "allow");
    ctx.Response.StatusCode = !processed && isPageRoute ? StatusCodes.Status200OK : StatusCodes.Status404NotFound;
    await ctx.Response.WriteAsync(html);
});



app.Run();
