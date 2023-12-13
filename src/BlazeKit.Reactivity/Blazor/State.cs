using BlazeKit.Abstraction;
using BlazeKit.Reactivity.Signals;
using System;
using System.ComponentModel;

namespace BlazeKit.Reactivity.Blazor;

/// <summary>
/// A <see cref="ISignal{T}"/> that can be used in a Blazor component."/>
/// Calls <see cref="IReactiveComponent.Update"/> when the value changes.
/// This will re-render the component when ever the value changes.
/// </summary>
public sealed class State<T> : ISignal<T>
{
    private readonly Signal<T> signal;
    private readonly Effect effect;
    private readonly IReactiveComponent component;

    /// <summary>
    /// A <see cref="ISignal{T}"/> that can be used in a Blazor component."/>
    /// Calls <see cref="IReactiveComponent.Update"/> when the value changes.
    /// This will re-render the component when ever the value changes.
    /// </summary>
    public State(T value, IReactiveComponent component)
    {
        this.signal = new Signal<T>(value);
        this.effect = new Effect(() =>
        {
            // required to keep track of the dependency
            var _ = signal.Value;
            component.Update();
        });
        this.component = component;
    }

    public T Value
    {
        get => signal.Value;
        set => signal.Value = value;
    }

    public void Subscribe(Action<T> subscriber)
    {
        this.signal.Subscribe(subscriber);
    }
}

public sealed class State
{
    /// <summary>
    /// Create a new <see cref="ISignal{T}"/> that can be used in a Blazor component."/>
    /// </summary>
    public static ISignal<TValue> New<TValue>(TValue value, IReactiveComponent component) => new State<TValue>(value, component);
}
