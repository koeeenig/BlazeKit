using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.RenderTree;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.Web.HtmlRendering;
using Microsoft.AspNetCore.Html;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Text.Encodings.Web;

namespace BlazeKit.Static;
#pragma warning disable BL0006 // Do not use RenderTree types

public sealed class BlazorRenderer : Renderer
{
    private readonly Lazy<HtmlRenderer> htmlRenderer;

    public BlazorRenderer(IServiceProvider serviceProvider) : this(
        () =>
            new HtmlRenderer(
                serviceProvider,
                serviceProvider.GetRequiredService<ILoggerFactory>()
            ),
            serviceProvider
    )
    { }

    public BlazorRenderer(HtmlRenderer htmlRenderer,IServiceProvider serviceProvider) :this(
        () => htmlRenderer,
        serviceProvider
    )
    { }

    public BlazorRenderer(Func<HtmlRenderer> htmlRenderer, IServiceProvider serviceProvider) : base(serviceProvider, serviceProvider.GetRequiredService<ILoggerFactory>())
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
            await output.QuiescenceTask;
            return output.ToHtmlString();
        });
    }

    //private Task<string> RenderComponent(Type componentType, ParameterView parameters)
    //{
    //    // Use the default dispatcher to invoke actions in the context of the
    //    // static HTML renderer and return as a string
    //    return htmlRenderer.Value.Dispatcher.InvokeAsync(async () =>
    //    {
    //        HtmlRootComponent output = await htmlRenderer.Value.RenderComponentAsync(componentType, parameters);
    //        await output.QuiescenceTask;

    //        return output.ToHtmlString();
    //    });
    //}

    private Task<string> RenderComponent(Type componentType, ParameterView parameters)
    {
        // Use the default dispatcher to invoke actions in the context of the
        // static HTML renderer and return as a string
        return htmlRenderer.Value.Dispatcher.InvokeAsync(async () =>
        {
            var output = this.htmlRenderer.Value.BeginRenderingComponent(componentType, parameters);
            await output.QuiescenceTask;
            return output.ToHtmlString();
        });
    }

    /// <summary>
    /// HTML content which can be written asynchronously to a TextWriter.
    /// </summary>
    public interface IHtmlAsyncContent : IHtmlContent
    {
        /// <summary>
        /// Writes the content to the specified <paramref name="writer"/>.
        /// </summary>
        /// <param name="writer">The <see cref="TextWriter"/> to which the content is written.</param>
        ValueTask WriteToAsync(TextWriter writer);
    }

    // An implementation of IHtmlContent that holds a reference to a component until we're ready to emit it as HTML to the response.
    // We don't construct the actual HTML until we receive the call to WriteTo.
    public class PrerenderedComponentHtmlContent : IHtmlAsyncContent
    {
        private readonly Dispatcher? _dispatcher;
        private readonly HtmlRootComponent? _htmlToEmitOrNull;

        public static PrerenderedComponentHtmlContent Empty { get; }
            = new PrerenderedComponentHtmlContent(null, default);

        public PrerenderedComponentHtmlContent(
            Dispatcher? dispatcher, // If null, we're only emitting the markers
            HtmlRootComponent? htmlToEmitOrNull)
        {
            _dispatcher = dispatcher;
            _htmlToEmitOrNull = htmlToEmitOrNull;
        }

        public async ValueTask WriteToAsync(TextWriter writer)
        {
            if (_dispatcher is null)
            {
                WriteTo(writer, HtmlEncoder.Default);
            }
            else
            {
                await _dispatcher.InvokeAsync(() => WriteTo(writer, HtmlEncoder.Default));
            }
        }

        public void WriteTo(TextWriter writer, HtmlEncoder encoder)
        {
            if (_htmlToEmitOrNull is { } htmlToEmit)
            {
                htmlToEmit.WriteHtmlTo(writer);
            }
        }

        public Task QuiescenceTask =>
            _htmlToEmitOrNull.HasValue ? _htmlToEmitOrNull.Value.QuiescenceTask : Task.CompletedTask;
    }


}
#pragma warning restore BL0006 // Do not use RenderTree types

