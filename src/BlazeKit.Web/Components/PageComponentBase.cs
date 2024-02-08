using BlazeKit.Hydration;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;
using Microsoft.AspNetCore.Http;

namespace BlazeKit.Web.Components;
public abstract class PageComponentBase<TResult> : IComponent, IPageLoad<TResult> where TResult : PageDataBase
{
    [Inject] required public DataHydrationContext HydrationContext { get; init; }
    [Inject] required public NavigationManager NavigationManager { get; init; }
    [CascadingParameter] private HttpContext? Context { get; set; }

    private RenderFragment renderFragment;
    private readonly string dataKey;
    private RenderHandle renderHandle;
    private TResult data;

    
    /// <summary>
    /// The data which has been loaded with LoadAsync.
    /// If the method is not overwritten by the derived class the
    /// page data will be null.
    /// </summary>
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
    public PageComponentBase()
    {
        renderFragment = builder =>
        {
            // decorate the ChildContent with a CascadingValue contianing the PageData
            builder.OpenComponent<global::Microsoft.AspNetCore.Components.CascadingValue<TResult>>(0);
            builder.AddComponentParameter(1, "Value", this.PageData);
            builder.AddComponentParameter(1, "Name", "PageData");
            builder.AddComponentParameter(2, "ChildContent", (RenderFragment)BuildRenderTree);
            builder.CloseComponent();
        };
        this.data = default(TResult);
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
            var route = new Uri(NavigationManager.Uri);
            var data = await this.ServerLoadAsync(route, Context);
            if(data != null)
            {
                this.data = data;
                // we add the data to the data hydration context to access it on client side
                HydrationContext.Add(this.dataKey, data);
            }
        }

        renderHandle.Render(renderFragment);
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

    protected virtual Task<TResult> ServerLoadAsync(Uri route, HttpContext? context)
    {
        return Task.FromResult<TResult>(default(TResult));
    }


    private bool IsServer()
    {
        return !OperatingSystem.IsBrowser();
    }
}
