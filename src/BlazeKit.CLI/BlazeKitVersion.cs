using System.Reflection;

namespace BlazeKit.CLI;

public class BlazeKitVersion : Lazy<string>
{
    public BlazeKitVersion() : base(() => {
        return "0.1.0-alpha.1";
    })
    { }
}
