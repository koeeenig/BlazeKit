using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;

namespace BlazeKit.Website.Islands;

[__PrivateComponentRenderModeAttribute]
public abstract class BlzInteractive : ComponentBase
{
    public BlzInteractive()
    { }

    private sealed class __PrivateComponentRenderModeAttribute : global::Microsoft.AspNetCore.Components.RenderModeAttribute
    {
        private static global::Microsoft.AspNetCore.Components.IComponentRenderMode ModeImpl => RenderMode.InteractiveWebAssembly;
        public override global::Microsoft.AspNetCore.Components.IComponentRenderMode Mode => ModeImpl;
    }
}
