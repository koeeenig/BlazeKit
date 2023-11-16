using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace BlazeKit.Reactive.Signals;

/// <summary>
/// A global Context stack used for tracking observers.
/// </summary>
internal class ReactiveContext
{
    public static Stack<Running> Stack = new Stack<Running>();

    internal class Running
    {
        public Action Execute;
        public HashSet<Running> Dependencies;

        public Running(Action execute)
        {
            Execute = execute;
            Dependencies = new HashSet<Running>();
        }
    }
}
