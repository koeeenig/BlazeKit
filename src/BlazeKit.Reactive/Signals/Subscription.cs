using System;

namespace BlazeKit.Reactive.Signals
{
    public sealed class Subscription : IDisposable
    {
        private bool disposed;
        public Subscription()
        {
            disposed = false;
        }
        public void Dispose()
        {
            disposed = true;
        }

        public bool IsDisposed()
        {
            return disposed;
        }
    }
}
