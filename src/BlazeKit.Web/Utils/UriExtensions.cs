using System.Collections.Specialized;

namespace BlazeKit.Web.Utils;

/// <summary>
/// Extensions methods for <see cref="Uri"/>
/// </summary>
public static class UriExtensions
{
    /// <summary>
    /// Checks wether a query parameter with the given name exists.
    /// </summary>
    /// <param name="uri">The <see cref="Uri"/> instance to check the existens of the query paramater</param>
    /// <param name="name">The name of the query parameter</param>
    /// <returns>True if the parameter exists. Otherwise False</returns>
    public static bool HasParam(this Uri uri, string name)
    {
        var queryDictionary = System.Web.HttpUtility.ParseQueryString(uri.Query);
        return HasParam(queryDictionary, name);
    }

    /// <summary>
    /// Gets the value of a query parameter by the given name.
    /// </summary>
    /// <param name="uri">The <see cref="Uri"/> instance to get the query paramater from.</param>
    /// <param name="name">The name of the query parameter</param>
    /// <returns>The value of the query parameter</returns>
    /// <exception cref="InvalidOperationException">Query Paramater doesn' exists</exception>
    public static string Param(this Uri uri, string name)
    {
        return Param(uri,name, () => throw new InvalidOperationException($"There is no query param with the name '{name}' in the route."));
    }

    /// <summary>
    /// Gets the value of a query parameter by the given name.
    /// Returns a fallback value if query parameter doesn't exist.
    /// </summary>
    /// <param name="uri">The <see cref="Uri"/> instance to get the query paramater from.</param>
    /// <param name="name">The name of the query parameter</param>
    /// <param name="fallback">The value whichis return if the query parameter doesn't exist.</param>
    /// <returns>The value of the query parameter</returns>
    public static string Param(this Uri uri, string name, string fallback)
    {
       return Param(uri,name, fallbackFunc: () => fallback);
    }

    /// <summary>
    /// Gets the value of a query parameter by the given name.
    /// Returns a fallback value if query parameter doesn't exist.
    /// </summary>
    /// <param name="uri">The <see cref="Uri"/> instance to get the query paramater from.</param>
    /// <param name="name">The name of the query parameter</param>
    /// <param name="fallbackFunc">The function to get the fallback value if any. Throws an expection when no fallback value is provided.</param>
    /// <returns>The value of the query parameter</returns>
    private static string Param(Uri uri, string name, Func<string> fallbackFunc)
    {
        string result;
        var queryDictionary = System.Web.HttpUtility.ParseQueryString(uri.Query);
        if (HasParam(queryDictionary,name))
        {
            result = queryDictionary[name];
        }
        else
        {
            result = fallbackFunc();
        }
        return result;
    }

    /// <summary>
    /// Checks wether a query parameter with the given name exists.
    /// </summary>
    /// <param name="queryParams">The <see cref="NameValueCollection"/> to check the exists in</param>
    /// <param name="name">The name of the query parameter</param>
    /// <returns></returns>
    private static bool HasParam(NameValueCollection queryParams, string name)
    {
        return queryParams.HasKeys() && queryParams.AllKeys.Contains(name);
    }
}
