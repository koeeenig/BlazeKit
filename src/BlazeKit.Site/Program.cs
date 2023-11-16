using BlazeKit.Site;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
//builder.Services.AddSingleton<BlazeKit.Core.Routing.Navigating>(services =>
//{
//    var router = services.GetRequiredService<NavigationManager>();
//    var jsRuntime = services.GetRequiredService<IJSRuntime>();
//    return new BlazeKit.Core.Routing.Navigating(router,jsRuntime, val => Console.WriteLine($"Navigating: {val}"));
//});

await builder.Build().RunAsync();
