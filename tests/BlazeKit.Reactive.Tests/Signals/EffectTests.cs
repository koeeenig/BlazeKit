using Xunit.Abstractions;

namespace BlazeKit.Reactive.Tests;

[Collection("Sequential")]
public sealed class EffectTests
{
    private readonly ITestOutputHelper output;

    public EffectTests(ITestOutputHelper output)
    {
        this.output = output;
    }

    [Theory]
    [InlineData(1)]
    [InlineData(4)]
    public void RunsEffect(int runs) {
        var counter = new Signal<int>(0);
        var called = 0;
        var effect =
            new Effect(() => {
                    output.WriteLine($"Effect called with value {counter.Value}");
                    called++;
            });

        // change the counter value
        for (var i = 0; i < runs; i++) {
            counter.Value++;
        }

        // check that the effect was called.
        // the effect is called once when it is created.
        called.Should().Be(runs + 1);
    }
}
