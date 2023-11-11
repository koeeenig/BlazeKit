using System;

namespace BlazeKit.Reactive
{
    public interface ISignal<T>
    {
        T Value { get; set; }
        IDisposable Subscribe(Action<T> subscriber);
    }
}
