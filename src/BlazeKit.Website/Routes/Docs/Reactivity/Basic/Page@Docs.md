# Basic Example

<div class="w-auto" client="load" blazelkit-id="e9c8a553-8213-42f3-8afd-5e4442ffff1a">
<!--Blazor:{"type":"webassembly","prerenderId":"e9c8a553-8213-42f3-8afd-5e4442ffff1a","key":{"locationHash":"78a4f2be-04b4-4f33-836f-987374068868","formattedComponentKey":""},"assembly":"BlazeKit.Website.Islands","typeName":"BlazeKit.Website.Islands.Components.Counter","parameterDefinitions":"W10=","parameterValues":"W10="}-->
<p>Loading Component...</p>
<progress class="progress"></progress>
<!--Blazor:{"prerenderId":"e9c8a553-8213-42f3-8afd-5e4442ffff1a"}-->
</div>

## Code Example

```csharp
protected override void OnInitialized()
{
    // Create a Signal
    this.counter = new State<int>(0, this);
    // Create a derived State
    this.doubled =
        new Derived<int>(
            () => counter.Value * 2,
            this
        );
    // Create an Effect
    this.sideEffect =
        new Effect(() =>
            {
                if(counter.Value > 0 && counter.Value % 2 == 0)
                {
                    // since booms in not a signal, we need to notify the UI manually
                    // this is required if the counter updates in background task
                    booms++;
                    InvokeAsync(StateHasChanged);
                }
            }
        );
}

<p>@counter.Value</p>
<p>Doubled Counter: @doubled.Value</p>
<p>Triggered Side Effects <code>(counter.Value % 5 == 0)</code>: @booms</p>
<button @onclick=\"() => counter.Value++\">Increment</button>
<button @onclick=\"() => counter.Value--\">Decrement</button>
```

### Conditional CSS Classes
```razor
<div class="w-56 h-5 bg-green-300
    @(
        new ConditionalClasses()
            .AddIf("bg-green-500",counter.Value % 2 == 0)
            .AddIf("bg-red-500",counter.Value % 2 != 0)
            .Apply()
    )"
></div>
```
