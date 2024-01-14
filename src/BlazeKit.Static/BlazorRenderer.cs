using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.RenderTree;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.Web.HtmlRendering;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace BlazeKit.Static;
#pragma warning disable BL0006 // Do not use RenderTree types

public sealed class BlazorRenderer : Renderer
{
    private readonly Lazy<HtmlRenderer> htmlRenderer;

    public BlazorRenderer(ServiceProvider serviceProvider) : this(
        () =>
            new HtmlRenderer(
                serviceProvider,
                serviceProvider.GetRequiredService<ILoggerFactory>()
            ),
            serviceProvider
    )
    { }

    public BlazorRenderer(HtmlRenderer htmlRenderer,ServiceProvider serviceProvider) :this(
        () => htmlRenderer,
        serviceProvider
    )
    { }

    public BlazorRenderer(Func<HtmlRenderer> htmlRenderer,ServiceProvider serviceProvider) : base(serviceProvider, serviceProvider.GetRequiredService<ILoggerFactory>())
    {
        this.htmlRenderer = new Lazy<HtmlRenderer>(htmlRenderer);
    }

    public override Dispatcher Dispatcher => this.htmlRenderer.Value.Dispatcher;


    /// <summary>
    /// Renders a component T which doesn't require any parameters
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public Task<string> RenderComponent<T>() where T : IComponent
        => RenderComponent<T>(ParameterView.Empty);

    /// <summary>
    /// Renders a component T using the provided dictionary of parameters
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="dictionary"></param>
    public Task<string> RenderComponent<T>(Dictionary<string, object?> dictionary) where T : IComponent
        => RenderComponent<T>(ParameterView.FromDictionary(dictionary));

    /// <summary>
    /// Renders a component T using the provided parameters
    /// </summary>
    /// <param name="componentType"></param>
    public Task<string> RenderComponent(Type componentType)
        => RenderComponent(componentType, ParameterView.Empty);

    /// <summary>
    /// Renders a component T using the provided dictionary of parameters
    /// </summary>
    /// <param name="componentType"></param>
    /// <param name="dictionary"></param>
    public Task<string> RenderComponent(Type componentType, Dictionary<string, object?> dictionary)
        => RenderComponent(componentType, ParameterView.FromDictionary(dictionary));

    protected override void HandleException(Exception exception)
    {
        throw new NotImplementedException();
    }

    protected override Task UpdateDisplayAsync(in RenderBatch renderBatch)
    {
        throw new NotImplementedException();
    }


    private Task<string> RenderComponent<T>(ParameterView parameters) where T : IComponent
    {
        // Use the default dispatcher to invoke actions in the context of the
        // static HTML renderer and return as a string
        return htmlRenderer.Value.Dispatcher.InvokeAsync(async () =>
        {
            HtmlRootComponent output = await htmlRenderer.Value.RenderComponentAsync<T>(parameters);
            return output.ToHtmlString();
        });
    }

    private Task<string> RenderComponent(Type componentType, ParameterView parameters)
    {
        // Use the default dispatcher to invoke actions in the context of the
        // static HTML renderer and return as a string
        return htmlRenderer.Value.Dispatcher.InvokeAsync(async () =>
        {
            HtmlRootComponent output = await htmlRenderer.Value.RenderComponentAsync(componentType, parameters);
            return output.ToHtmlString();
        });
    }


}
#pragma warning restore BL0006 // Do not use RenderTree types

