// See https://aka.ms/new-console-template for more information
using BlazeKit.Tools;
using BlazeKit.Website;
using BlazeKit.Website.Islands.Components;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

if (args.Count() > 0 && args[0] == "ssg") {
    Console.WriteLine("Building Static Site");

    if(args.Count() < 2) {
        Console.WriteLine("SSG Error: No output path provided");
        return;
    }
    Console.WriteLine($"SSG Output: {args[1]}");

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

builder.Services.AddSingleton<IDevTools>((sp) => {
       var result = new List<string>();
        var assemblies = AppDomain.CurrentDomain.GetAssemblies().Where(asm => !asm.FullName.StartsWith("Microsoft.") || !asm.FullName.StartsWith("System."));
        foreach(var asm in assemblies) {
            result.AddRange(
            asm.GetExportedTypes()
                .Select(t => {
                    Console.WriteLine($"Looking for Routes in {t.Assembly.FullName}");
                    return t;
                })
                .Where(t => t.GetCustomAttributes(typeof(RouteAttribute), true).Count() > 0)
                .Select(t =>
                {
                    var route = t.GetCustomAttributes(typeof(RouteAttribute), true).FirstOrDefault() as RouteAttribute;
                    return route!.Template;
                })
            );
        }


        var components = new List<string>();
        assemblies =
            new DirectoryInfo(AppDomain.CurrentDomain.BaseDirectory).GetFiles("*.dll").ToList().Select(file => {
                // load assembly for reflection only
                var assembly = System.Reflection.Assembly.LoadFile(file.FullName);
                return assembly;
            });

        foreach (var assembly in assemblies)
        {
            Console.WriteLine(assembly.FullName);
            components.AddRange(
                assembly
                .GetExportedTypes()
                .Where(t => t.IsClass)
                .Where(t => t.BaseType == (typeof(ComponentBase))  || t.BaseType.Name == "ReactiveComponentEnvelope")
                .Select(t =>
                {
                    return $"{t.FullName}";
                })
            );
        }

        return new DevToolsState(result,components.Distinct().ToList());
});


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
