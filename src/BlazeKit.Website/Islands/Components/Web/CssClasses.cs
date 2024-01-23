namespace BlazeKit.Web;
public sealed class ConditionalClasses
{
    private IDictionary<string, Func<bool>> classes;
    public ConditionalClasses()
    {
        classes = new Dictionary<string, Func<bool>>();
    }

    public ConditionalClasses AddIf(string className, bool condition)
    {
        return this.AddIf(className,() => condition);
    }

    public ConditionalClasses AddIf(string className, Func<bool> condition)
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
