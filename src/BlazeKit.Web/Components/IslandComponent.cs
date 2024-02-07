using BlazeKit.Abstraction;
using BlazeKit.Hydration;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;

namespace BlazeKit.Web.Components;


public abstract class IslandComponent : IslandComponent<PageDataBase>
{
    
}

public abstract class IslandComponent<TResult> : IComponent, IHandleEvent, IReactiveComponent
{
    [Parameter] public ClientHydrateMode Client { get; set; } = ClientHydrateMode.None;

    [Inject] required public DataHydrationContext HydrationContext { get; init; }
    [Inject] private Microsoft.Extensions.Hosting.IHostEnvironment HostEnvironment { get; init; }

    private RenderFragment renderFragment;
    private RenderHandle renderHandle;
    private TResult data;
    private string dataKey;
    private string prerenderId = Guid.NewGuid().ToString();
    private string locationhash = Guid.NewGuid().ToString();

    
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

    public IslandComponent(/*string dataKey*/)
    {
        renderFragment = BuildRenderTree;
        this.dataKey = "pagedata";
    }

    public void Attach(RenderHandle renderHandle)
    {
        this.renderHandle = renderHandle;
    }
    public async Task SetParametersAsync(ParameterView parameters)
    {
        parameters.SetParameterProperties(this);

        if(IsServer())
        {
            // render the component decorated with the wasm marker
            renderHandle.Render(Render);
        } else
        {
            // Render component without the wasm marker
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
        }

        if(OperatingSystem.IsBrowser())
        {
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
    protected virtual void OnMount()
    { }


    void Render(RenderTreeBuilder builder)
    {
        var needsHydration = Client != ClientHydrateMode.None;
        if (!HostEnvironment.EnvironmentName.Equals("Development", StringComparison.InvariantCultureIgnoreCase))
        {
            // render marker around the balzekit div.
            // This will remove the div when the component is hydrated on the client
            if (needsHydration)
            {
                builder.AddMarkupContent(0, OpenWasmComponent());
            }

            builder.OpenElement(1, "div");
            builder.AddAttribute(2, "blazekit-id", prerenderId);
            builder.AddAttribute(3, "client", Client.ToString().ToLower());

            builder.OpenComponent<global::Microsoft.AspNetCore.Components.CascadingValue<TResult>>(0);
            builder.AddComponentParameter(1, "Value", this.PageData);
            builder.AddComponentParameter(2, "ChildContent", renderFragment);
            builder.CloseComponent();

            //this.BuildRenderTree(builder);
            builder.CloseElement();

            if (needsHydration)
            {
                builder.AddMarkupContent(4, CloseWasmComponent());
            }

        }
        else
        {
            // render the marker around the component. This will leave the blazekit div in place when the component is hydrated on the client
            // we can use this div to visualize the component boundaries in the browser
            builder.OpenElement(0, "div");
            builder.AddAttribute(1, "blazekit-id", prerenderId);
            builder.AddAttribute(2, "client", Client.ToString().ToLower());
            if (needsHydration)
                builder.AddMarkupContent(0, OpenWasmComponent());


            builder.OpenComponent<global::Microsoft.AspNetCore.Components.CascadingValue<TResult>>(0);
            builder.AddComponentParameter(1, "Value", this.PageData);
            builder.AddComponentParameter(2, "ChildContent", (RenderFragment)((builder2) => BuildRenderTree(builder2)));
            builder.CloseComponent();


            if (needsHydration)
            {
                builder.AddMarkupContent(4, CloseWasmComponent());
            }

            builder.CloseElement();
        }
    }
   
    protected Task<T> LoadHydratedPageDataAsync<T>(T fallback)
    {
        return HydrationContext.GetAsync<T>(dataKey, fallback);
    }

    private string OpenWasmComponent()
    {
        var typeName = this.GetType().FullName;
        var assemblyName = $"{this.GetType().Assembly.GetName().Name}";
        return @$"<!--Blazor:{{""type"":""webassembly"",""prerenderId"":""{prerenderId}"",""key"":{{""locationHash"":""{locationhash}"",""formattedComponentKey"":""""}},""assembly"":""{assemblyName}"",""typeName"":""{typeName}"",""parameterDefinitions"":""W10="",""parameterValues"":""W10=""}}-->";
    }

    private string CloseWasmComponent()
    {
        return @$"<!--Blazor:{{""prerenderId"":""{prerenderId}""}}-->";
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
