namespace BlazeKit.Web.Utils;
public sealed class CssClass
{
    private IDictionary<string, Func<bool>> classes;
    public CssClass()
    {
        classes = new Dictionary<string, Func<bool>>();
    }

    public CssClass AddIf(string className, bool condition)
    {
        return this.AddIf(className,() => condition);
    }

    public CssClass AddIf(string className, Func<bool> condition)
    {
        if(this.classes.ContainsKey(className))
        {
            this.classes[className] = condition;
        } else {
            this.classes.Add(className,condition);
        }
        return this;
    }

    public string Apply() {
        return
            string.Join(
                " ",
                this.classes
                    .Where(x => x.Value())
                    .Select(x => x.Key)
            );
    }
}
