// See https://aka.ms/new-console-template for more information
using BlazeKit.Static;
using BlazeKit.Tools;
using BlazeKit.Website;
using BlazeKit.Website.Islands;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.Extensions.DependencyInjection;


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

// Add services to the container.
builder.Services.AddRazorComponents()
            .AddInteractiveWebAssemblyComponents();

builder.Services.AddSingleton<IDevTools>(_ => new DevToolsState());
// call .Value to add the servies to the collection
new StaticServiceCollection(builder.Services).Services();

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
// app.UseBlazorFrameworkFiles();

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<BlazeKit.Website.Index>()
        .AddInteractiveWebAssemblyRenderMode();

app.Run();
