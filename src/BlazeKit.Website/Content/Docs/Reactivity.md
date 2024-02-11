---
title: Reactivity - Docs - BlazeKit
category: Reactivity
draft: false
slug: reactivity
---
#  Reactivity
BlazeKit with a reactivity system that allows developers to create interactive and dynamic web applications. This system is built around the concept of reactive primitives, which are inspired by the signals pattern. Reactive primitives are objects that hold a value and notify subscribers when this value changes.

# ISignal&lt;T&gt;
The foundation of the reactivity system is the `ISignal<T>` interface. This interface encapsulates a value of type T and provides a Subscribe method for subscribing to changes in the value.

```csharp
public interface ISignal<T>
{
    T Value { get; set; }
    void Subscribe(Action<T> subscriber);
}
```

# Signal
The `Signal` class is a fundamental part of the reactivity system. It is a type of reactive primitive that encapsulates a value and notifies all subscribers when the value changes.
A Signal encapsulates a value of type `T` and notifies all subscribers when the value changes.

The main purpose of the `Signal` class is to hold a value and allow components to react to changes in this value. This makes it easy to create dynamic and interactive applications where e.g. the UI updates in response to changes in the application's state.

```csharp
// Create a new signal
var counter = new Signal<int>(0);

// Subscribe to changes in the signal
counter.Subscribe(value => Debug.WriteLine($"Counter is: {value}"));

// Change the value of the signal
counter.Value = 1;  // This will trigger the subscription and print "Counter is: 1" to the debug console
```
In this example, a `Signal` is created that holds an integer value. The `Subscribe` method is used to subscribe to changes in the value of the signal. Whenever the value of the signal changes, the provided function is called with the new value.

The `Signal` class provides a simple and efficient way to manage state in a application. By using signals, you can create components that automatically update in response to changes in your application's state.

# Computed
The `Computed` class is used to derive a new value from one or more other signals. It's a type of reactive primitive that automatically updates its value when any of its dependencies change.
```csharp
// Define signals for the length and width of the rectangle
var length = new Signal<double>(5.0);
var width = new Signal<double>(10.0);
// Define a computed for the area of the rectangle
var area = new Computed<double>(() => length.Value * width.Value);
// Subscribe to changes in the area
area.Subscribe(value => Debug.WriteLine($"Area is: {value}"));
```

# Effect
 An `Effect` class is used to handle side effects in response to changes in signals. A side effect is any operation that interacts with the outside world, such as writing to the console, making a network request, or updating the DOM.

The Effect class takes a function in its constructor, which is executed whenever any of the signals that it depends on change. Here's an example:
```csharp
new Effect(() => {
        Debug.WriteLine($"Counter is: {counter}");
    }
);
```
In this example, an `Effect` is created that depends on the counter signal. The function passed to the `Effect` constructor writes the current value of the counter to the debug console. This function is executed whenever the counter changes.

This allows you to easily perform side effects in response to changes in your application's state. The `Effect` class ensures that your side effects are always in sync with your state, and it manages the subscriptions to the signals for you.

# Blazor Signals

These primitives can be used to build reactive components which are updated when the state changes.
Have you ever forget the `StateHasChanged` call after updating a value? I bet you did. With the Blazor specific `Signals` this will not happen again. The call to `StateHasChanged` will be handled for you when ever the value of the `Signal` changes. 🎉

## State
For your convenience BlazeKit provides a `State` class which invokes `StateHasChanged` when the value has changed.

```csharp
var counter = new State<int>(0,this);
```
When ever the value of `counter` changes, the component will be re-rendered.

## Derived
Just like `State`, `Derived` is a convenience class which invokes `StateHasChanged` when the value has changed.

```csharp
var derived =
    new Derived<int>(() => {
        // side-effect free -> do not change the state in derived states
        var doubled = Counter.Value * 2;
        Debug.WriteLine($"Doubled is: {doubled}");
        return doubled;
    },
    this
);
```
