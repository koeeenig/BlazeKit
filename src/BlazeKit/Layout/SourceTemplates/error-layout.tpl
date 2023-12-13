using Microsoft.AspNetCore.Components;

using Microsoft.AspNetCore.Components;
using BlazeKit.Abstraction;
namespace BlazeKit.Site.Routes;
[Route("{route}")]
[Layout(typeof({layout}))]
public partial class ErrorLayout : LayoutComponentBase, IComponent {
	private RenderHandle renderHandle;
	void IComponent.Attach(RenderHandle renderHandle) => this.renderHandle = renderHandle;
	Task IComponent.SetParametersAsync(ParameterView parameters) {
		renderHandle.Render(builder => {
            builder.OpenComponent<global::Microsoft.AspNetCore.Components.Web.ErrorBoundary>(0);
            builder.AddAttribute(1, "ErrorContent", new global::Microsoft.AspNetCore.Components.RenderFragment<System.Exception>(context => builder2 =>
            {
                builder2.OpenComponent<{errorComponent}>(2);
                builder2.CloseComponent();
            }));
            builder.AddAttribute(3, "ChildContent",(global::Microsoft.AspNetCore.Components.RenderFragment)(builder2 => {
                builder2.AddContent(4, Body);
            }));
            builder.CloseComponent();
        });
		return Task.CompletedTask;
	}
}
