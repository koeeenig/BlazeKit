namespace BlazeKit.Tools;
public interface IDevTools {

    IList<string> Routes();
    IList<string> Components();

}

public class DevToolsState : IDevTools {

    private readonly IList<string> routes;
    private readonly IList<string> components;

    public DevToolsState(IList<string> routes, IList<string> components)
    {
        this.routes = routes;
        this.components = components;
    }

    public IList<string> Routes() => routes;
    public IList<string> Components() => components;

}
