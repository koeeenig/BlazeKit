using BlazeKit.Hydration;
using BlazeKit.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.JSInterop;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.Services.AddSingleton<IHostEnvironment>(new BKitHostEnvironment("Production"));
builder.Services.AddSingleton(sp =>
    new BlazeKit.Hydration.DataHydrationContext(async () => {
        return
            await sp.GetRequiredService<IJSRuntime>()
                .InvokeAsync<string>("BlazeKit.loadPageData");
    })
);
await builder.Build().RunAsync();
