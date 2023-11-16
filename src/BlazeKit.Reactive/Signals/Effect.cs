using System;

namespace BlazeKit.Reactive.Signals;

/// <summary>
/// An effect that is triggered by one ore more <see cref="ISignal{T}"/>s
/// </summary>
public sealed class Effect
{
    private readonly Action execute;
    private ReactiveContext.Running running;

    /// <summary>
    /// An effect that is triggered by one ore more <see cref="ISignal{T}"/>s
    /// </summary>
    public Effect(Action fn)
    {
        this.execute = () =>
        {
            Cleanup(running);
            ReactiveContext.Stack.Push(running);
            try
            {
                fn();
            }
            finally
            {
                ReactiveContext.Stack.Pop();
            }
        };

        this.running = new ReactiveContext.Running(execute);

        this.execute();
    }

    private void Cleanup(ReactiveContext.Running running)
    {
        foreach (var dependency in running.Dependencies)
        {
            dependency.Dependencies.Remove(running);
        }

        running.Dependencies.Clear();
    }
}

