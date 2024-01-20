using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;

namespace BlazeKit.Website.Islands;

public abstract class WASMIsland : ComponentBase
{
    [Parameter]
    public ClientLoadMode Client { get; set; } = ClientLoadMode.Idle;

    public WASMIsland()
    {
    }

    public enum ClientLoadMode
    {
        Idle,
        Hover,
        Visible,
        None
    }
}
