using BlazeKit.Abstraction;
using BlazeKit.Hydration;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;

namespace BlazeKit.Web.Components;


public abstract class IslandComponent<TResult> : IComponent, IHandleEvent, IClientLoad, IReactiveComponent, IComponentRenderMode
{
    [Parameter] public ClientHydrateMode Client { get; set; } = ClientHydrateMode.None;

    [Inject] required public DataHydrationContext HydrationContext { get; init; }
    [Inject] private Microsoft.Extensions.Hosting.IHostEnvironment HostEnvironment { get; init; }

    private RenderFragment renderFragment;
    private RenderHandle renderHandle;
    private TResult data;
    private TResult clientData;
    private string dataKey;
    private readonly string id = Guid.NewGuid().ToString();
    private ComponentMarker marker;


    /// <summary>
    /// The data which has been loaded with LoadAsync.
    /// If the method is not overwritten by the derived class the
    /// page data will be null.
    /// </summary>
    [CascadingParameter(Name = "PageData")]
    public TResult PageData
    {
        get
        {
            return data;
        }
        set
        {
            data = value;
        }
    }

    public IslandComponent()
    {
        renderFragment = builder =>
        {
            builder.OpenElement(1, "div");
            builder.AddAttribute(2, "blazekit-id", id);
            builder.AddAttribute(3, "client", Client.ToString().ToLower());
            // render the start marker
            builder.AddMarkupContent(4, this.marker.ToStartMarker());
            // render the developer defined markup
            BuildRenderTree(builder);
            builder.AddMarkupContent(4, this.marker.ToEndMarker());
            builder.CloseElement();
        };
        this.dataKey = "pagedata";
    }

    public void Attach(RenderHandle renderHandle)
    {
        this.renderHandle = renderHandle;
    }
    public async Task SetParametersAsync(ParameterView parameters)
    {
        // if we are on the client we do not set the cascading page data value because blazor will complain that cascading parameter can't be set explizitly
        if(!IsServer())
        {
            var filtered =
                new Dictionary<string,object>(
                    parameters
                        .ToDictionary()
                        .Where(k => !k.Key.Equals("pagedata", StringComparison.InvariantCultureIgnoreCase))
                );
            parameters = ParameterView.FromDictionary(filtered);

        }
        parameters.SetParameterProperties(this);
        this.marker = new ComponentMarker(this.GetType(),parameters);

        if (IsServer())
        {
            // render the component without data hydration because on the server we have a "full-fledged" interactiv component tree
            renderHandle.Render(renderFragment);
        }
        else
        {
            // on the client side, load the page data from the hydrated data item in the DOM and populate it in the components params
            var data = await LoadHydratedPageDataAsync(default(TResult));
            if (data == null)
            {
                throw new InvalidOperationException($"Could not load page data for '{this.dataKey}'");
            }
            else
            {
                this.data = data;
            }
            renderHandle.Render(renderFragment);

            // call client-side lifcycle hook
            OnMount();
        }
    }

    /// <summary>
    /// Renders the component to the supplied <see cref="RenderTreeBuilder"/>.
    /// </summary>
    /// <param name="builder">A <see cref="RenderTreeBuilder"/> that will receive the render output.</param>
    protected virtual void BuildRenderTree(RenderTreeBuilder builder)
    {
        // Developers can either override this method in derived classes, or can use Razor
        // syntax to define a derived class and have the compiler generate the method.

        // Other code within this class should *not* invoke BuildRenderTree directly,
        // but instead should invoke the _renderFragment field.
    }

    /// <summary>
    /// This method is called slient-side when the component has been mounted/rendered into the DOM
    /// </summary>
    protected virtual void OnMount() { }

    /// <summary>
    /// This method get's called server-side after the component received it's initial paramater values and before rendering the component in e.g SSR mode.
    /// Use this lifecycle hook to set internal values which are dependent on Parameters.
    /// </summary>
    protected virtual void OnServerInit() { }

    
    protected Task<T> LoadHydratedPageDataAsync<T>(T fallback)
    {
        return HydrationContext.GetAsync<T>(dataKey, fallback);
    }

    private bool IsServer()
    {
        return !OperatingSystem.IsBrowser();
    }

    public Task HandleEventAsync(EventCallbackWorkItem callback, object? arg)
    {
        var task = callback.InvokeAsync(arg);
        var shouldAwaitTask = task.Status != TaskStatus.RanToCompletion &&
            task.Status != TaskStatus.Canceled;

        // After each event, we synchronously re-render (unless !ShouldRender())
        // This just saves the developer the trouble of putting "StateHasChanged();"
        // at the end of every event callback.
        Update();

        return Task.CompletedTask;

        //return shouldAwaitTask ?
        //    CallStateHasChangedOnAsyncCompletion(task) :
        //    Task.CompletedTask;
    }

    public void Update()
    {
        renderHandle.Render(renderFragment);
    }
}

