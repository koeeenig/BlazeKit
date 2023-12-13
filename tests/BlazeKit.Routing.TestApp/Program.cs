using BlazeKit.Routing.TestApp;
using BlazeKit.Routing.TestApp.Routes;
using BlazorMinimalApi.Components;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Endpoints;
using Microsoft.AspNetCore.Components.HtmlRendering.Infrastructure;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Http.HttpResults;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents();
    // .AddInteractiveWebAssemblyComponents();

// builder.Services.AddSingleton<RouteManager>();
// builder.Services.AddBlazeKitApiRoutes();

// Add the renderer and wrapper to services
// builder.Services.AddScoped<HtmlRenderer>();
// builder.Services.AddScoped<BlazorRenderer>();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseStaticFiles();
app.UseRouting();
app.UseHttpsRedirection();
app.UseBlazorWebJS();
// app.UseBlazorWebAssemblyRenderMode();
app.UseAntiforgery();



app.MapGet("{*restOfPath}", async (HttpContext ctx) => {
    Console.WriteLine($"Path: {ctx.Request.Path}");
    var parameters = new Dictionary<string, object> {};
    var rendered =  new RazorComponentResult<App>(parameters);
    var customCtx = new CustomHttpContext(ctx);
    // customCtx.RequestServices = app.Services;
    // customCtx.Response.Body = new MemoryStream();
    // var customCtx = new CustomHttpContext(ctx);
    await rendered.ExecuteAsync(customCtx);

    customCtx.Response.Body.Seek(0, SeekOrigin.Begin);

    // read response body as string
    using(var reader = new StreamReader(customCtx.Response.Body))
    {
        var content = reader.ReadToEnd();
        Console.WriteLine($"Content: {content}");
        var result =  Results.Content(content, "text/html");
        return result;
    }
});

// app.MapRazorComponents<App>();
    // .AddInteractiveServerRenderMode();

// app.MapBlazeKitApiRoutes();


app.Run();
