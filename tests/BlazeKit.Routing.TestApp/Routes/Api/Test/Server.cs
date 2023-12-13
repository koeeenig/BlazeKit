using BlazeKit.Abstraction;
namespace BlazeKit.Routing.TestApp;

public class Server : IPostRequest
{
    public Delegate Post()
    {
        return () => {
            return Results.Text("Hello World!");
        };
    }
}
