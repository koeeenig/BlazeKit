using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using BlazeKit.Website.Islands;
using BlazeKit.Website.Islands.Components;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
// register the Greeting component as a custom element
// requires -> dotnet add package Microsoft.AspNetCore.Components.CustomElements
// builder.RootComponents.RegisterCustomElement<Counter>("bkit-counter");
await builder.Build().RunAsync();
