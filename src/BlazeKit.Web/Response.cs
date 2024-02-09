using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlazeKit.Web;

/// <summary>
/// Response class implementing <see cref="IResponse"/>
/// </summary>
public class Response : IResponse
{
    private readonly HttpContext? context;

    /// <summary>
    /// Response class implementing <see cref="IResponse"/>
    /// </summary>
    public Response(HttpContext? context)
    {
        this.context = context;
    }

    /// <inheritdoc/>
    public T Redirect<T>(string uri)
    {
        EnsureNotNull();
        context!.Response.Redirect(uri);
        return default(T);
    }

    /// <inheritdoc/>
    public void SetHeader(string key, string value)
    {

        EnsureNotNull();
        context!.Response.Headers.Add(key, value);
    }

    /// <inheritdoc/>
    public void SetCookie(string key, string value, CookieOptions options)
    {
        EnsureNotNull();
        context!.Response.Cookies.Append(key, value, options);
    }

    public void SetStatusCode(int statusCode)
    {
        EnsureNotNull();
        this.context!.Response.StatusCode = statusCode;
    }

    private void EnsureNotNull()
    {
        if (context is null)
        {
            throw new InvalidOperationException("HttpContext is null");
        }
    }
}
