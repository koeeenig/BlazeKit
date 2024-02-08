using BlazeKit.Abstraction;
using BlazeKit.Hydration;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;

namespace BlazeKit.Web.Components;

//[InteractiveWebAssembly]
public abstract class IslandComponent : IComponent, IHandleEvent, IClientLoad, IReactiveComponent, IComponentRenderMode
{
    [Parameter] public ClientHydrateMode Client { get; set; } = ClientHydrateMode.None;

    [Inject] required public DataHydrationContext HydrationContext { get; init; }
    [Inject] private Microsoft.Extensions.Hosting.IHostEnvironment HostEnvironment { get; init; }

    private RenderFragment renderFragment;
    private RenderHandle renderHandle;
    private readonly string id = Guid.NewGuid().ToString();
    private ComponentMarker marker;



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
            builder.AddMarkupContent(5, this.marker.ToEndMarker());
            builder.CloseElement();
        };
    }

    public void Attach(RenderHandle renderHandle)
    {
        this.renderHandle = renderHandle;
    }
    public async Task SetParametersAsync(ParameterView parameters)
    {
        parameters.SetParameterProperties(this);

        this.marker = new ComponentMarker(this.GetType(), parameters);

        if(IsServer())
        {
            // Call init code for server side only. The code run's before the renderer kicks in.
            OnServerInit();
            renderHandle.Render(renderFragment);
        } else {
            renderHandle.Render(renderFragment);
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


    protected virtual void OnServerInit() { }


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
