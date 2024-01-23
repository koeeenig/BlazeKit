#  Overview
BlazeKit provides a set of reactive primitives which are inspired by the signals pattern.
All primitives are based on the `ISignal<T>` interface which is defined as follows:
```csharp
public interface ISignal<T>
{
    T Value { get; set; }
    void Subscribe(Action<T> subscriber);
}
```

## `Signal`
A Signal encapsulates a value of type `T` and notifies all subscribers when the value changes.

```csharp
var counter = new Signal<int>(0);
```
When ever the value of `counter` changes, the component will be re-rendered.
A signal can be subscribed by calling the `Subscribe` method.
```csharp
counter.Subscribe((value) => {
    Debug.WriteLine($"Counter is: {value}");
});
```


## `Computed`
This class is used to derive a new value from one or more other signals.
```csharp
 var doubled =
        new Computed<int>(
            () => {
                // side-effect free -> do not change the state in derived states
                var doubled = Counter.Value * 2;
                Debug.WriteLine($"Doubled is: {doubled}");
                return doubled;
            }
        );
```
Since the `Computed` class is a `ISignal<T>` it can be subscribed as well.
```csharp
doubled.Subscribe((value) => {
    Debug.WriteLine($"Doubled is: {value}");
});
```

## `Effect`
An effect is used to execute a side-effect when signals change.
```csharp
new Effect(() => {
        Debug.WriteLine($"Counter is: {counter}");
    }
);
```
# Blazor specific Signals

These primitives can be used to build reactive components which are updated when the state changes.
Have you ever forget the `StateHasChanged` call after updating a value? I bet you did. With the Blazor specific `Signals` this will not happen again. The call to `StateHasChanged` will be handled for you when ever the value of the `Signal` changes. 🎉

## `State`
For your convenience BlazeKit provides a `State` class which invokes `StateHasChanged` when the value has changed.

```csharp
var counter = new State<int>(0,this);
```
When ever the value of `counter` changes, the component will be re-rendered.

## `Derived`
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
