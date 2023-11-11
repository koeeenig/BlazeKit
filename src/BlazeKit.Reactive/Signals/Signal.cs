using System;

namespace BlazeKit.Reactive.Signals
{
    public sealed class Signal<T> : SignalEnvelope<T>
    {
        public Signal(T initialValue, Action<T> subscriber) : this(
            () => initialValue,
            subscriber
        )
        { }

        public Signal(T initialValue) : this(
            () => initialValue,
            _ => { }
        )
        { }

        public Signal(Func<T> initialValue) : this(
            initialValue,
            _ => { }

        )
        { }

        public Signal(Func<T> initialValue, Action<T> subscriber) : base(initialValue, subscriber)
        { }
    }
}
