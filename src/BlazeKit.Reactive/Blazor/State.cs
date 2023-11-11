using BlazeKit.Abstraction;
using BlazeKit.Reactive.Signals;
using System;

namespace BlazeKit.Reactive.Blazor
{
    public sealed class State<T> : SignalEnvelope<T>
    {
        public State(T initialValue, IReactiveComponent component) : this(
            () => initialValue,
            _ => component.Update()
        )
        { }

        public State(Func<T> initialValue) : this(
            initialValue,
            _ => { }
            
        )
        { }

        public State(Func<T> initialValue, Action<T> subscriber) : base(initialValue, subscriber)
        { }
    }
}
