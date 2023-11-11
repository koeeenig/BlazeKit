using System;

namespace BlazeKit.Reactive
{
    public interface IEffect<T> : IDisposable
    {
        void Start();
    }
}
