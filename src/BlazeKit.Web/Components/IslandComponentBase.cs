using BlazeKit.Abstraction;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;

namespace BlazeKit.Web.Components;

//
// Summary:
//     Optional base class for components. Alternatively, components may implement Microsoft.AspNetCore.Components.IComponent
//     directly.
public abstract class IslandComponentBase : IComponent, IHandleEvent, IHandleAfterRender, IReactiveComponent
{
    [Parameter]
    public ClientHydrateMode Client { get; set; } = ClientHydrateMode.None;

     [Inject]
    public Microsoft.Extensions.Hosting.IHostEnvironment HostEnvironment { get; set; }

    private readonly RenderFragment _renderFragment;

    private RenderHandle _renderHandle;

    private bool _initialized;

    private bool _hasNeverRendered = true;

    private bool _hasPendingQueuedRender;

    private bool _hasCalledOnAfterRender;

    private string prerenderId = Guid.NewGuid().ToString();
    private string locationhash = Guid.NewGuid().ToString();

    

    //
    // Summary:
    //     Constructs an instance of Microsoft.AspNetCore.Components.ComponentBase.
    public IslandComponentBase()
    {
        _renderFragment = delegate (RenderTreeBuilder builder)
        {
            _hasPendingQueuedRender = false;
            _hasNeverRendered = false;
            // BuildRenderTree(builder);
            if(!OperatingSystem.IsBrowser()) {
                // render the component decorated with the wasm marker
                Render(builder);
            }
            else {
                // Render component without the wasm marker
                BuildRenderTree(builder);
            }

        };
    }

    void Render(RenderTreeBuilder builder)
    {
        var needsHydration = Client != ClientHydrateMode.None;
        if(!HostEnvironment.EnvironmentName.Equals("Development", StringComparison.InvariantCultureIgnoreCase))
        {
                // render marker around the balzekit div.
                // This will remove the div when the component is hydrated on the client
                if(needsHydration)
                {
                    builder.AddMarkupContent(0, OpenWasmComponent());
                }

                builder.OpenElement(1, "div");
                builder.AddAttribute(2, "blazekit-id", prerenderId);
                builder.AddAttribute(3, "client", Client.ToString().ToLower());
                this.BuildRenderTree(builder);
                builder.CloseElement();

                if(needsHydration)
                {
                    builder.AddMarkupContent(4, CloseWasmComponent());
                }

            } else {
                // render the marker around the component. This will leave the blazekit div in place when the component is hydrated on the client
                // we can use this div to visualize the component boundaries in the browser
                builder.OpenElement(0, "div");
                builder.AddAttribute(1, "blazekit-id", prerenderId);
                builder.AddAttribute(2, "client", Client.ToString().ToLower());
                if(needsHydration)
                    builder.AddMarkupContent(0, OpenWasmComponent());

                this.BuildRenderTree(builder);
                if(needsHydration)
                {
                    builder.AddMarkupContent(4, CloseWasmComponent());
                }

                builder.CloseElement();
            }
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

    // Summary:
    //     Renders the component to the supplied Microsoft.AspNetCore.Components.Rendering.RenderTreeBuilder.
    //
    //
    // Parameters:
    //   builder:
    //     A Microsoft.AspNetCore.Components.Rendering.RenderTreeBuilder that will receive
    //     the render output.
    protected virtual void BuildRenderTree(RenderTreeBuilder builder){}

    //
    // Summary:
    //     Method invoked when the component is ready to start, having received its initial
    //     parameters from its parent in the render tree.
    protected virtual void OnInitialized()
    {
    }

    //
    // Summary:
    //     Method invoked when the component is ready to start, having received its initial
    //     parameters from its parent in the render tree. Override this method if you will
    //     perform an asynchronous operation and want the component to refresh when that
    //     operation is completed.
    //
    // Returns:
    //     A System.Threading.Tasks.Task representing any asynchronous operation.
    protected virtual Task OnInitializedAsync()
    {
        return Task.CompletedTask;
    }

    //
    // Summary:
    //     Method invoked when the component has received parameters from its parent in
    //     the render tree, and the incoming values have been assigned to properties.
    protected virtual void OnParametersSet()
    {
    }

    //
    // Summary:
    //     Method invoked when the component has received parameters from its parent in
    //     the render tree, and the incoming values have been assigned to properties.
    //
    // Returns:
    //     A System.Threading.Tasks.Task representing any asynchronous operation.
    protected virtual Task OnParametersSetAsync()
    {
        return Task.CompletedTask;
    }

    //
    // Summary:
    //     Notifies the component that its state has changed. When applicable, this will
    //     cause the component to be re-rendered.
    protected void StateHasChanged()
    {
        if (_hasPendingQueuedRender || (!_hasNeverRendered && !ShouldRender() && !_renderHandle.IsRenderingOnMetadataUpdate))
        {
            return;
        }

        _hasPendingQueuedRender = true;
        try
        {
            _renderHandle.Render(_renderFragment);
        }
        catch
        {
            _hasPendingQueuedRender = false;
            throw;
        }
    }

    //
    // Summary:
    //     Returns a flag to indicate whether the component should render.
    protected virtual bool ShouldRender()
    {
        return true;
    }

    //
    // Summary:
    //     Method invoked after each time the component has rendered interactively and the
    //     UI has finished updating (for example, after elements have been added to the
    //     browser DOM). Any Microsoft.AspNetCore.Components.ElementReference fields will
    //     be populated by the time this runs. This method is not invoked during prerendering
    //     or server-side rendering, because those processes are not attached to any live
    //     browser DOM and are already complete before the DOM is updated.
    //
    // Parameters:
    //   firstRender:
    //     Set to true if this is the first time Microsoft.AspNetCore.Components.ComponentBase.OnAfterRender(System.Boolean)
    //     has been invoked on this component instance; otherwise false.
    //
    // Remarks:
    //     The Microsoft.AspNetCore.Components.ComponentBase.OnAfterRender(System.Boolean)
    //     and Microsoft.AspNetCore.Components.ComponentBase.OnAfterRenderAsync(System.Boolean)
    //     lifecycle methods are useful for performing interop, or interacting with values
    //     received from @ref. Use the firstRender parameter to ensure that initialization
    //     work is only performed once.
    protected virtual void OnAfterRender(bool firstRender)
    {
    }

    //
    // Summary:
    //     Method invoked after each time the component has been rendered interactively
    //     and the UI has finished updating (for example, after elements have been added
    //     to the browser DOM). Any Microsoft.AspNetCore.Components.ElementReference fields
    //     will be populated by the time this runs. This method is not invoked during prerendering
    //     or server-side rendering, because those processes are not attached to any live
    //     browser DOM and are already complete before the DOM is updated. Note that the
    //     component does not automatically re-render after the completion of any returned
    //     System.Threading.Tasks.Task, because that would cause an infinite render loop.
    //
    //
    // Parameters:
    //   firstRender:
    //     Set to true if this is the first time Microsoft.AspNetCore.Components.ComponentBase.OnAfterRender(System.Boolean)
    //     has been invoked on this component instance; otherwise false.
    //
    // Returns:
    //     A System.Threading.Tasks.Task representing any asynchronous operation.
    //
    // Remarks:
    //     The Microsoft.AspNetCore.Components.ComponentBase.OnAfterRender(System.Boolean)
    //     and Microsoft.AspNetCore.Components.ComponentBase.OnAfterRenderAsync(System.Boolean)
    //     lifecycle methods are useful for performing interop, or interacting with values
    //     received from @ref. Use the firstRender parameter to ensure that initialization
    //     work is only performed once.
    protected virtual Task OnAfterRenderAsync(bool firstRender)
    {
        return Task.CompletedTask;
    }

    //
    // Summary:
    //     Executes the supplied work item on the associated renderer's synchronization
    //     context.
    //
    // Parameters:
    //   workItem:
    //     The work item to execute.
    protected Task InvokeAsync(Action workItem)
    {
        return _renderHandle.Dispatcher.InvokeAsync(workItem);
    }

    //
    // Summary:
    //     Executes the supplied work item on the associated renderer's synchronization
    //     context.
    //
    // Parameters:
    //   workItem:
    //     The work item to execute.
    protected Task InvokeAsync(Func<Task> workItem)
    {
        return _renderHandle.Dispatcher.InvokeAsync(workItem);
    }

    //
    // Summary:
    //     Treats the supplied exception as being thrown by this component. This will cause
    //     the enclosing ErrorBoundary to transition into a failed state. If there is no
    //     enclosing ErrorBoundary, it will be regarded as an exception from the enclosing
    //     renderer. This is useful if an exception occurs outside the component lifecycle
    //     methods, but you wish to treat it the same as an exception from a component lifecycle
    //     method.
    //
    // Parameters:
    //   exception:
    //     The System.Exception that will be dispatched to the renderer.
    //
    // Returns:
    //     A System.Threading.Tasks.Task that will be completed when the exception has finished
    //     dispatching.
    protected Task DispatchExceptionAsync(Exception exception)
    {
        return _renderHandle.DispatchExceptionAsync(exception);
    }

    void IComponent.Attach(RenderHandle renderHandle)
    {
        if (_renderHandle.IsInitialized)
        {
            throw new InvalidOperationException("The render handle is already set. Cannot initialize a ComponentBase more than once.");
        }

        _renderHandle = renderHandle;
    }

    //
    // Summary:
    //     Sets parameters supplied by the component's parent in the render tree.
    //
    // Parameters:
    //   parameters:
    //     The parameters.
    //
    // Returns:
    //     A System.Threading.Tasks.Task that completes when the component has finished
    //     updating and rendering itself.
    //
    // Remarks:
    //     Parameters are passed when Microsoft.AspNetCore.Components.ComponentBase.SetParametersAsync(Microsoft.AspNetCore.Components.ParameterView)
    //     is called. It is not required that the caller supply a parameter value for all
    //     of the parameters that are logically understood by the component.
    //
    //     The default implementation of Microsoft.AspNetCore.Components.ComponentBase.SetParametersAsync(Microsoft.AspNetCore.Components.ParameterView)
    //     will set the value of each property decorated with Microsoft.AspNetCore.Components.ParameterAttribute
    //     or Microsoft.AspNetCore.Components.CascadingParameterAttribute that has a corresponding
    //     value in the Microsoft.AspNetCore.Components.ParameterView. Parameters that do
    //     not have a corresponding value will be unchanged.
    public virtual Task SetParametersAsync(ParameterView parameters)
    {
        parameters.SetParameterProperties(this);
        if (!_initialized)
        {
            _initialized = true;
            return RunInitAndSetParametersAsync();
        }

        return CallOnParametersSetAsync();
    }

    private async Task RunInitAndSetParametersAsync()
    {
        OnInitialized();
        Task task = OnInitializedAsync();
        if (task.Status != TaskStatus.RanToCompletion && task.Status != TaskStatus.Canceled)
        {
            StateHasChanged();
            try
            {
                await task;
            }
            catch
            {
                if (!task.IsCanceled)
                {
                    throw;
                }
            }
        }

        await CallOnParametersSetAsync();
    }

    private Task CallOnParametersSetAsync()
    {
        OnParametersSet();
        Task task = OnParametersSetAsync();
        bool num = task.Status != TaskStatus.RanToCompletion && task.Status != TaskStatus.Canceled;
        StateHasChanged();
        if (!num)
        {
            return Task.CompletedTask;
        }

        return CallStateHasChangedOnAsyncCompletion(task);
    }

    private async Task CallStateHasChangedOnAsyncCompletion(Task task)
    {
        try
        {
            await task;
        }
        catch
        {
            if (task.IsCanceled)
            {
                return;
            }

            throw;
        }

        StateHasChanged();
    }

    Task IHandleEvent.HandleEventAsync(EventCallbackWorkItem callback, object arg)
    {
        Task task = callback.InvokeAsync(arg);
        bool num = task.Status != TaskStatus.RanToCompletion && task.Status != TaskStatus.Canceled;
        StateHasChanged();
        if (!num)
        {
            return Task.CompletedTask;
        }

        return CallStateHasChangedOnAsyncCompletion(task);
    }

    Task IHandleAfterRender.OnAfterRenderAsync()
    {
        bool firstRender = !_hasCalledOnAfterRender;
        _hasCalledOnAfterRender = true;
        OnAfterRender(firstRender);
        return OnAfterRenderAsync(firstRender);
    }

    public void Update()
    {
        StateHasChanged();
    }
}
