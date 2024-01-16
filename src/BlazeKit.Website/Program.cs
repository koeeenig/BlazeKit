// See https://aka.ms/new-console-template for more information
using BlazeKit.Website;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

if (args.Count() > 0 && args[0] == "ssg") {
    Console.WriteLine("Building Static Site");
    new BlazeKit.Static.StaticSiteGenerator(
        Path.Combine(".blazekit","build","ssg"),
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
