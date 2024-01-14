﻿// See https://aka.ms/new-console-template for more information

using BlazeKit.Website;

if (args.Count() > 0 && args[0] == "ssg") {
    Console.WriteLine("Building Static Site");
    new BlazeKit.Static.StaticSiteGenerator(
        ".blazekit/build/ssg",
        ".blazekit/build/tmp/wwwroot",
        typeof(BlazeKit.Website.Index).Assembly
    ).Build();
    Console.WriteLine("Static Site Built");
    return;
}

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents().AddInteractiveWebAssemblyComponents();

var app = builder.Build();
app.UseRouting();
// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
} else {
    // app.UseWebAssemblyDebugging();
}
// app.UseBlazorFrameworkFiles();

app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<BlazeKit.Website.Index>().AddInteractiveWebAssemblyRenderMode();

app.Run();