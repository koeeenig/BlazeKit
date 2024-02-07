using BlazeKit.Website.Islands.Components;
using Microsoft.AspNetCore.Components;

namespace BlazeKit.Tools;
public interface IDevTools {

    IList<string> Routes();
    IList<string> Components();

}

public class DevToolsState : IDevTools {

    private readonly Lazy<IList<string>> routes;
    private readonly Lazy<IList<string>> components;

    public DevToolsState() :this(
        new Lazy<Tuple<IList<string>, IList<string>>>(() => {
                var result = new List<string>();
                var assemblies = AppDomain.CurrentDomain.GetAssemblies().Where(asm => !asm.FullName.StartsWith("Microsoft", StringComparison.InvariantCultureIgnoreCase) && !asm.FullName.StartsWith("System",StringComparison.InvariantCultureIgnoreCase)).ToList();
                foreach (var asm in assemblies)
                {
                    Console.WriteLine($"Looking for Routes in {asm.FullName}");
                    result.AddRange(
                    asm.GetExportedTypes()
                        .Where(t => t.GetCustomAttributes(typeof(RouteAttribute), true).Count() > 0)
                        .Select(t =>
                        {
                            var route = t.GetCustomAttributes(typeof(RouteAttribute), true).FirstOrDefault() as RouteAttribute;
                            return route!.Template;
                        })
                    );
                }


                var components = new List<string>();
                assemblies =
                    new DirectoryInfo(AppDomain.CurrentDomain.BaseDirectory)
                        .GetFiles("*.dll")
                        .Where(file => !file.Name.StartsWith("Microsoft", StringComparison.InvariantCultureIgnoreCase) && !file.Name.StartsWith("System", StringComparison.InvariantCultureIgnoreCase))
                        .ToList().Select(file =>
                    {
                        // load assembly for reflection only
                        var assembly = System.Reflection.Assembly.LoadFile(file.FullName);
                        return assembly;
                    }).ToList();

                foreach (var assembly in assemblies)
                {
                    Console.WriteLine(assembly.FullName);
                    components.AddRange(
                        assembly
                        .GetExportedTypes()
                        .Where(t => t.IsClass)
                        .Where(t => t.BaseType == (typeof(ComponentBase)) || t.BaseType.Name == "ReactiveComponentEnvelope")
                        .Select(t =>
                        {
                            return $"{t.FullName}";
                        })
                    );
                }

                return Tuple.Create<IList<string>,IList<string>>(result, components.Distinct().ToList());
        })
    )
    {

    }

    public DevToolsState(Lazy<Tuple<IList<string>, IList<string>>> routesAndComponents) : this(
        () => routesAndComponents.Value.Item1,
        () => routesAndComponents.Value.Item2
    )
    { }



    public DevToolsState(Func<IList<string>> routes, Func<IList<string>> components)
    {
        this.routes = new Lazy<IList<string>>(routes);
        this.components = new Lazy<IList<string>>(components);
    }

    public IList<string> Routes() => routes.Value;
    public IList<string> Components() => components.Value;

}
