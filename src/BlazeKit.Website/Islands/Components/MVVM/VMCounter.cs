using BlazeKit.Abstraction;
using BlazeKit.Reactivity;
using BlazeKit.Reactivity.Blazor;

namespace BlazeKit.Website.Components.Islands.MVVM
{
    public sealed class VMCounter
    {
        public ISignal<int> Counter { get; private set; }

        public ISignal<int> Doubled { get; private set; }

        public VMCounter(IReactiveComponent component)
        {
            this.Counter = State.New(0, component);
            this.Doubled = Derived.New(() => this.Counter.Value * 2, component);
        }

        /// <summary>
        /// Increments the counter
        /// </summary>
        public void Increment()
        {
            this.Counter.Value++;
        }
        /// <summary>
        /// Decrements the counter
        /// </summary>
        public void Decrement()
        {
            this.Counter.Value--;
        }
    }
}
