using System;
using System.Collections.Generic;
using System.Linq;

namespace BlazeKit.Reactive.Signals
{
    public sealed class Effect<T> /* : IEffect<T> */
    {
        private readonly List<IDisposable> subs;
        private readonly Action start;
        private readonly Action effect;

        public Effect(Action effect, params ISignal<T>[] from) : this(effect, () => new List<ISignal<T>>(from))
        { }

        public Effect(Action effect, Func<IEnumerable<ISignal<T>>> from)
        {
            subs = new List<IDisposable>();
            foreach (var signal in from())
            {
                subs.Add(signal.Subscribe((_) => effect()));
            }
            //start = () =>
            //{
            //    foreach (var signal in from())
            //    {
            //        subs.Add(signal.Subscribe((_) => effect()));
            //    }
            //};
            this.effect = effect;
        }

        public void Dispose()
        {
            foreach (var sub in subs)
            {
                sub.Dispose();
            }
        }

        public void Start()
        {
            effect();
            start();

        }
    }
}
