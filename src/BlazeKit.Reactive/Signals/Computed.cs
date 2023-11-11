using System;
using System.Collections.Generic;

namespace BlazeKit.Reactive.Signals
{
    public class Computed<TValue, TSignal> : ISignal<TValue>
    {
        private readonly List<IDisposable> subs;
        private readonly Lazy<ISignal<TValue>> signal;

        public Computed(ISignal<TSignal> signal1, ISignal<TSignal> signal2, ISignal<TSignal> signal3, ISignal<TSignal> signal4, Func<TValue> compute, Action<TValue> subscriber) : this(
           compute,
           subscriber,
           signal1, signal2, signal3, signal4
        )
        { }

        public Computed(ISignal<TSignal> signal1, ISignal<TSignal> signal2, ISignal<TSignal> signal3, Func<TValue> compute, Action<TValue> subscriber) : this(
           compute,
           subscriber,
           signal1, signal2, signal3
        )
        { }
        public Computed(ISignal<TSignal> signal1, ISignal<TSignal> signal2, Func<TValue> compute, Action<TValue> subscriber) : this(
           compute,
           subscriber,
           signal1, signal2
        )
        { }
        public Computed(ISignal<TSignal> signal, Func<TValue> compute, Action<TValue> subscriber) : this(
            compute,
            subscriber,
            signal
        )
        { }

        public Computed(Func<TValue> compute, Action<TValue> subscriber, params ISignal<TSignal>[] from)
        {
            subs = new List<IDisposable>();
            this.signal =
                new Lazy<ISignal<TValue>>(() =>
                    new Signal<TValue>(compute(), val => {
                        subscriber(val);
                    })
                );
            
            foreach (var dependingSignal in from)
            {
                // call compute if a depending signal changes
                subs
                    .Add(dependingSignal
                            .Subscribe((_) => this.signal.Value.Value = compute()) 
                    );
            }
        }

        public TValue Value
        {
            get
            {
                return this.signal.Value.Value;
            }
            set => throw new InvalidOperationException("Derived signals are read-only");

        }

        public IDisposable Subscribe(Action<TValue> subscriber)
        {
            return signal.Value.Subscribe(subscriber);
        }
    }
}
