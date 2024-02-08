using BlazeKit.Abstraction;
using BlazeKit.Reactivity.Signals;
using System;
using System.Collections.Generic;

namespace BlazeKit.Reactivity.Blazor;

/// <summary>
/// A derived value as <see cref="ISignal{T}"/> that can be used in a Blazor component."/>
/// Calls <see cref="IReactiveComponent.Update"/> when the derived value changes.
/// This will re-render the component when ever the value changes.
/// </summary>
public sealed class Derived<T> : ISignal<T>
{
    private HashSet<Action> subscriptions;
    private readonly Effect effect;
    private T value;
    private bool initialCall = false;

    /// <summary>
    /// A derived value as <see cref="ISignal{T}"/> that can be used in a Blazor component."/>
    /// Calls <see cref="IReactiveComponent.Update"/> when the derived value changes.
    /// This will re-render the component when ever the value changes.
    /// </summary>
    public Derived(Func<T> fn, IReactiveComponent component)
    {
        this.subscriptions = new HashSet<Action>();
        this.effect = new Effect(() =>
        {
            var derived = fn();
            Console.WriteLine($"{derived}");
            if(!this.value.Equals(derived))
            {
                this.value = derived;
                foreach (var subscription in subscriptions)
                {
                    subscription();
                }
                if(!initialCall)
                {
                    component.Update();
                    initialCall = true;
                }

            }
        });
    }

    /// <inheritdoc/>
    public T Value
    {
        get => this.value;
        set => throw new InvalidOperationException("Derived Signals are readonly");
    }

    /// <inheritdoc/>
    public void Subscribe(Action<T> subscriber)
    {
        subscriptions.Add(() => subscriber(this.value));
    }
}

public sealed class Derived
{
    /// <summary>
    /// A derived value as <see cref="ISignal{T}"/> that can be used in a Blazor component."/>
    /// Calls <see cref="IReactiveComponent.Update"/> when the derived value changes.
    /// This will re-render the component when ever the value changes.
    /// </summary>
    public static ISignal<TValue> New<TValue>(Func<TValue> fn, IReactiveComponent component) => new Derived<TValue>(fn, component);
}
