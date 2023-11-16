using System;

namespace BlazeKit.Reactive;
/// <summary>
/// A reactive primitive
/// </summary>
public interface ISignal<T>
{
    /// <summary>
    /// The value of the signal
    /// </summary>
    T Value { get; set; }

    /// <summary>
    /// Subscribe to the signal
    /// </summary>
    void Subscribe(Action<T> subscriber);
}
