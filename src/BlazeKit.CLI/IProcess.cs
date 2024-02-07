using System.Diagnostics;

namespace  BlazeKit;

public interface IProcess
{
    void Input<T>(T cmd);
    Process Run();
}
