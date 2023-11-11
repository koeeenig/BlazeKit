using BlazeKit.Abstraction;
using BlazeKit.Reactive.Signals;
using System;

namespace BlazeKit.Reactive.Blazor
{
    public sealed class Derived<TValue,TSignal> : Computed<TValue,TSignal>
    {
        public Derived(ISignal<TSignal> signal1, ISignal<TSignal> signal2, ISignal<TSignal> signal3, ISignal<TSignal> signal4, Func<TValue> compute, IReactiveComponent component) : this(
           compute,
           component,
           signal1, signal2, signal3, signal4
        )
        { }

        public Derived(ISignal<TSignal> signal1, ISignal<TSignal> signal2, ISignal<TSignal> signal3, Func<TValue> compute, IReactiveComponent component) : this(
           compute,
           component,
           signal1, signal2, signal3
        )
        { }
        public Derived(ISignal<TSignal> signal1, ISignal<TSignal> signal2, Func<TValue> compute, IReactiveComponent component) : this(
           compute,
           component,
           signal1, signal2
        )
        { }
        public Derived(ISignal<TSignal> signal, Func<TValue> compute, IReactiveComponent component) : this(
            compute,
            component,
            signal
        )
        { }

        public Derived(Func<TValue> compute, IReactiveComponent component, params ISignal<TSignal>[] from) : base(compute,(_) => component.Update(),from)
        {
            
        }
    }
}
