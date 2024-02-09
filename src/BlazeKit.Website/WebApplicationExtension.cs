using BlazeKit.Static;
using System.Runtime.CompilerServices;

namespace BlazeKit.Website
{

    public static class ServiceCollectionExtensions
    {
        public static void AddBlazeKit(this ServiceCollection sc)
        {
            // sc.AddBlazeKitApiRoutes();
        }
    }

    public static class WebApplicationExtension
    {
        public static void UseBlazeKit(this WebApplication app)
        {
            app.Use(async (HttpContext ctx, RequestDelegate next) =>
            {
                // Add a check if the requested route exists for this app.
                // A Source Generator should genérate a class which knows all routes present in the app.
                // We than can distict between api routes (endpoints) and page routes.
                // This might enbale co-locating the api routes with page routes

                var sc = new ServiceCollection();
                sc.AddSingleton<HttpContext>(ctx);
                new StaticServiceCollection(sc).Services();


                var html = await new PageRenderer(typeof(BlazeKit.Website.Index), sc).Render(ctx.Request.Path);
                ctx.Response.Headers.Add("Content-Type", "text/html");
                ctx.Response.Headers.Add("Blazor-Enhanced-Nav", "allow");
                ctx.Response.StatusCode = 200;
                await ctx.Response.WriteAsync(html);
            });

            // 👇 This maps the routes with the given http methods
            // app.MapBlazeKitApiRoutes();
        }
    }
}
