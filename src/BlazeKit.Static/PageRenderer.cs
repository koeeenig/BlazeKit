using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Routing;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.JSInterop;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlazeKit.Static
{
    public  class PageRenderer
    {
        private readonly Type rootComponent;
        private readonly IServiceCollection serviceCollection;

        public PageRenderer(Type rootComponent,IServiceCollection serviceCollection)
        {
            this.rootComponent = rootComponent;
            this.serviceCollection = serviceCollection;
        }
        public async Task<string> Render(string route)
        {
            var routeManager = new StaticNavigationManager();

            serviceCollection.AddLogging();
            serviceCollection.AddSingleton<IHostEnvironment>(new BKitHostEnvironment("Production"));
            serviceCollection.AddSingleton<NavigationManager>(routeManager);
            serviceCollection.AddSingleton<IJSRuntime>(new FkJsRuntime());
            serviceCollection.AddSingleton<INavigationInterception>(new FkNavigationInterception());
            serviceCollection.AddSingleton<IScrollToLocationHash>(new FkScrollToLocationHash());
            serviceCollection.AddSingleton<IErrorBoundaryLogger>(new StaticErrorBoundaryLogger());

            var spv = serviceCollection.BuildServiceProvider();
            var scoped = spv.CreateScope();
            var serviceProvider = scoped.ServiceProvider;

            routeManager.NavigateTo(route, forceLoad: true);
            var renderer =
                new BlazorRenderer(
                        new HtmlRenderer(
                            serviceProvider,
                            serviceProvider
                                .GetRequiredService<ILoggerFactory>()
                        ),
                        serviceProvider
                    );
            var html =
                await renderer.RenderComponent(this.rootComponent);

            return html;

        }
    }
}
