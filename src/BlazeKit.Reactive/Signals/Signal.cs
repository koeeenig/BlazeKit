using System;
using System.Net.Http.Headers;

namespace BlazeKit.Reactive.Signals;

/// <summary>
/// A <see cref="ISignal{T}"/>
/// </summary>

public sealed class Signal<T> : SignalEnvelope<T>
{
    /// <summary>
    /// A <see cref="ISignal{T}"/>
    /// </summary>
    public Signal(T initialValue) : base(initialValue)
    { }
}

public sealed class Signal
{
    /// <summary>
    /// Create a new <see cref="ISignal{T}"/>
    /// </summary>
    public static ISignal<TValue> New<TValue>(TValue value) => new Signal<TValue>(value);
}

