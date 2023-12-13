// using BlazeKit.Reactive.Tests;
// using Xunit.Abstractions;

// namespace BlazeKit.Reactive.Blazor.Tests;

// public sealed class StateTests
// {
//     private readonly ITestOutputHelper output;

//     public StateTests(ITestOutputHelper output)
//     {
//         this.output = output;
//     }
//     [Fact]
//     public void InvokesUpdate() {
//         var called = 0;
//         var state =
//             new State<int>(0,
//             new FkReactiveComponent(() => {
//                 called++;
//             })
//             );

//         state.Value++;
//         called.Should().Be(1);
//     }
// }
