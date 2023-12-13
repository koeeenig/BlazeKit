using System.Text;
using Xunit.Abstractions;

namespace BlazeKit.Reactive.Tests;

[Collection("Sequential")]
public sealed class SignalTests
{
    private readonly ITestOutputHelper output;

    public SignalTests(ITestOutputHelper output)
    {
        this.output = output;
    }

    [Fact]
    public void Notifies() {
        var called = 0;

        output.WriteLine("1. Create Signal");
        var signal = new Signal<int>(0);
        output.WriteLine("2. Create Reaction");
        new Effect(() =>
        {
            output.WriteLine($"The count is: {signal.Value}");
            called++;
        });
        output.WriteLine("3. Set the count to 5");
        signal.Value = 5;

        output.WriteLine("4. Set the count to 10");
        signal.Value = 10;


        called.Should().Be(3);
    }

    
}


