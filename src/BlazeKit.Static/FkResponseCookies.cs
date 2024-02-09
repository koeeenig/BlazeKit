using Microsoft.AspNetCore.Http;

namespace BlazeKit.Static;
/// <summary>
/// A <see cref="IResponseCookies"/> implementation for static site generation purposes"/>
/// </summary>
internal class FkResponseCookies : IResponseCookies
{
    public void Append(string key, string value)
    {
        // do nothing
    }

    public void Append(string key, string value, CookieOptions options)
    {
        // do nothing
    }

    public void Delete(string key)
    {
        // do nothing
    }

    public void Delete(string key, CookieOptions options)
    {
        // do nothing
    }
}
