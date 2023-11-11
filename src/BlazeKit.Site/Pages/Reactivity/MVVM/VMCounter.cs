using BlazeKit.Abstraction;
using BlazeKit.Reactive;
using BlazeKit.Reactive.Blazor;

namespace BlazeKit.Site.Pages.Reactivity.MVVM
{
    public sealed class VMCounter
    {
        public ISignal<int> Counter { get; set; }
        public bool Started { get; private set; }
        public VMCounter(IReactiveComponent component)
        {
            this.Counter = new State<int>(0, component);
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

        public void StartBackgroundTask()
        {
            if (!Started)
            {
                Task.Run(async () =>
                {
                    while (true)
                    {
                        Counter.Value++;
                        await Task.Delay(1000);
                    }
                });
                Started = true;
            }
        }
    }
}
