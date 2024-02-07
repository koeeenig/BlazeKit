using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;

namespace BlazeKit.Web.Components;

/// <summary>
/// Determines when a interactive component should be hydrated on the client
/// </summary>
public enum ClientHydrateMode
{
    /// <summary>
    /// Hydrates the component as soon as possible
    /// </summary>
    Load,
    /// <summary>
    /// Hydrates the component when the browser is idle
    /// </summary>
    Idle,
    /// <summary>
    /// Hydrates the component when the user hovers over it
    /// </summary>
    Hover,
    /// <summary>
    /// Hydrates the component when it is visible in the viewport
    /// </summary>
    Visible,
    /// <summary>
    /// Does not hydrate the component
    /// The component will be rendered as a static HTML element
    /// </summary>
    None
}
