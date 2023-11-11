using System;
using System.Collections.Generic;

namespace BlazeKit.Reactive.Signals
{

    public abstract partial class SignalEnvelope<T> : ISignal<T>
    {
        private T current;
        private readonly Lazy<IDictionary<Subscription, Action<T>>> subscribers;
        public T Value
        {
            get
            {
                return current;
            }
            set
            {
                if (current == null || !current.Equals(value))
                {
                    current = value;
                    Notify(current);
                }
            }
        }

        public SignalEnvelope(T initialValue, Action<T> subscriber) : this(
            () => initialValue,
            subscriber
        )
        { }

        public SignalEnvelope(Func<T> initialValue, Action<T> subscriber)
        {
            subscribers = 
                new Lazy<IDictionary<Subscription,Action<T>>>(() =>
                   new Dictionary<Subscription, Action<T>>() {
                       { new Subscription(), subscriber }
                   }
                );
            current = initialValue();
        }

        public IDisposable Subscribe(Action<T> subscriber)
        {
            var sub = new Subscription();
            subscribers.Value.Add(sub, subscriber);
            return sub;
        }

        private void Notify(T value)
        {
            foreach (var subscriber in subscribers.Value)
            {
                if (subscriber.Key.IsDisposed())
                {
                    subscribers.Value.Remove(subscriber);
                }
                else
                {
                    subscriber.Value(value);
                }
            }
        }
    }
}
