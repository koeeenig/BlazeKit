using System;
using System.Collections.Generic;

namespace BlazeKit.Reactivity.Signals;

/// <summary>
/// A computed value from on ore more <see cref="ISignal{T}"/>s
/// </summary>
public sealed class Computed<T> : ISignal<T>
{
    private readonly Signal<T> signal;
    private readonly Effect effect;

    /// <summary>
    /// A computed value from on ore more <see cref="ISignal{T}"/>s
    /// </summary>
    public Computed(Func<T> fn)
    {
        this.signal = new Signal<T>(default(T));
        this.effect = new Effect(() => signal.Value = fn());
    }

    /// <inheritdoc/>
    public T Value
    {
        get => signal.Value;
        set => throw new InvalidOperationException($"Computed Signals are readonly");
    }

    /// <inheritdoc/>
    public void Subscribe(Action<T> subscriber)
    {
        this.signal.Subscribe(subscriber);
    }
}
