using System;
using System.Collections.Generic;

namespace BlazeKit.Reactive.Signals;

/// <summary>
/// An envelope for a <see cref="ISignal{T}"/>
/// </summary>
public abstract class SignalEnvelope<T> : ISignal<T>
{
    private T value;
    private HashSet<ReactiveContext.Running> subscriptions = new HashSet<ReactiveContext.Running>();
    public SignalEnvelope(T initialValue)
    {
        this.value = initialValue;
    }

    /// <inheritdoc/>
    public T Value
    {
        get
        {
            if (ReactiveContext.Stack.TryPeek(out var running))
            {
                Track(running, subscriptions);
            }

            return this.value;
        }
        set
        {
            this.value = value;
            foreach (var subscription in subscriptions)
            {
                subscription.Execute();
            }
        }
    }

    /// <inheritdoc/>
    public void Subscribe(Action<T> subscriber)
    {
        this.subscriptions.Add(new ReactiveContext.Running(() => subscriber(this.value)));
    }
    private void Track(ReactiveContext.Running running, HashSet<ReactiveContext.Running> subscriptions)
    {
        subscriptions.Add(running);
        foreach (var subscription in subscriptions)
        {
            running.Dependencies.Add(subscription);
        }
    }
}
