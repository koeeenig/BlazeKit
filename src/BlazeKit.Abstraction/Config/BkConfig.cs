using System.IO;
using System.Text.Json;

namespace BlazeKit.Abstraction.Config;

internal class BkConfig
{
    public BkConfig()
    {
        Routes = "Routes";
        Tailwindcss = null;
    }
    public string Routes { get; set; }
    public TailwindcssConfig Tailwindcss { get; set; }


    public static bool TryLoad(out BkConfig config)
    {
        return
            TryLoad(
                new DirectoryInfo(Directory.GetCurrentDirectory()),
                out config
            );
    }


    public static bool TryLoad(DirectoryInfo directory, out BkConfig config)
    {
        var exists = false;
        config = new BkConfig();
        var path = Path.Combine(directory.FullName, "blazekit.config.json");
        // load blazekit.config.json file if it exists
        if (File.Exists(path))
        {
            exists = true;
            config = JsonSerializer.Deserialize<BkConfig>(File.ReadAllText("blazekit.config.json"))!;
        }

        return exists;
    }
}

internal class TailwindcssConfig
{
    public string Input { get; set; }
    public string Output { get; set; }
}

internal static class BkConfigExtensions
{
    public static bool HasTailwindcss(this BkConfig config)
    {
        return config.Tailwindcss != null;
    }
}

