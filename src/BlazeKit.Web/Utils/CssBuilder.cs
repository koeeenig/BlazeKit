namespace BlazeKit.Web.Utils;

/// <summary>
/// A class to apply conditional CSS classes
/// </summary>
public sealed class CssBuilder
{
    private IDictionary<string, Func<bool>> classes;
    private string prefix = "";

    /// <summary>
    /// A class to apply conditional CSS classes
    /// </summary>
    public CssBuilder()
    {
        classes = new Dictionary<string, Func<bool>>();
    }

    /// <summary>
    /// Adds a conditional CSS Class to the builder with space separator.
    /// </summary>
    /// <param name="className">CSS Class to conditionally add.</param>
    /// <param name="when">Condition in which the CSS Class is added.</param>
    /// <returns><see cref="CssBuilder"/></returns>
    public CssBuilder AddIf(string className, bool when)
    {
        return this.AddIf(className,() => when);
    }

    /// <summary>
    /// Adds a conditional CSS Class to the builder with space separator.
    /// </summary>
    /// <param name="className">CSS Class to conditionally add.</param>
    /// <param name="when">Condition in which the CSS Class is added.</param>
    /// <returns><see cref="CssBuilder"/></returns>
    public CssBuilder AddIf(string className, Func<bool> when)
    {
        var prefixed = $"{this.prefix}{className}";
        if(this.classes.ContainsKey(prefixed))
        {
            this.classes[prefixed] = when;
        } else {
            this.classes.Add(prefixed, when);
        }
        return this;
    }

    /// <summary>
    /// Sets the prefix value to be prepended to all classes added following this statement.
    /// When SetPrefix is called it will overwrite any previous prefix set for this instance.
    /// </summary>
    /// <param name="value">The prefix</param>
    /// <returns><see cref="CssBuilder"/></returns>
    public CssBuilder SetPrefix(string prefix)
    {
        this.prefix = prefix;
        return this;
    }

    /// <summary>
    /// The conditional CSS classes as string
    /// </summary>
    /// <returns>The CSS classes as string</returns>
    public string Apply() {
        return
            string.Join(
                " ",
                this.classes
                    .Where(x => x.Value())
                    .Select(x => x.Key.Trim())
            );
    }

    /// <summary>
    /// The conditional CSS classes as string
    /// </summary>
    /// <returns>The CSS classes as string</returns>
    public override string ToString() => Apply();
}
