namespace BlazeKit.Reactivity.Blazor;
/// <summary>
/// An Envelope for <see cref="BlazeKit.Abstraction.IReactiveComponent"/>.
/// Inherit your Blazor Component from this class to get <see cref="BlazeKit.Abstraction.IReactiveComponent.Update"/> for free in none BlazeKit apps.
/// None BlazeKit apps are only using BlazeKit.Reactivitiy package instead of the full BlazeKit package.
/// </summary>
public abstract class ReactiveComponentEnvelope : Microsoft.AspNetCore.Components.ComponentBase, BlazeKit.Abstraction.IReactiveComponent
{
    /// <summary>
    /// An Envelope for <see cref="BlazeKit.Abstraction.IReactiveComponent"/>.
    /// Inherit from this class to get <see cref="BlazeKit.Abstraction.IReactiveComponent.Update"/> for free in none BlazeKit apps.
    /// </summary>
    public ReactiveComponentEnvelope() : base()
    { }
    public void Update() => InvokeAsync(StateHasChanged);

}
