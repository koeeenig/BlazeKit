using BlazeKit.Abstraction;

namespace BlazeKit.Reactive.Tests;

public class FkReactiveComponent : IReactiveComponent
{
    private readonly Action onUpdate;

    public FkReactiveComponent(Action onUpdate)
    {
        this.onUpdate = onUpdate;
    }
    public void Update()
    {
        this.onUpdate();
    }
}
