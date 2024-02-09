using Microsoft.AspNetCore.Http;

namespace BlazeKit.Web;

/// <summary>
/// Interface for a response
/// </summary>
public interface IResponse
{
    /// <summary>
    /// Set a header on the response
    /// </summary>
    /// <param name="key">Header key</param>
    /// <param name="value">Header value</param>
    void SetHeader(string key, string value);

    /// <summary>
    /// Redirect the response to a new URI
    /// </summary>
    /// <param name="uri">Target Uri</param>
    T Redirect<T>(string uri);

    /// <summary>
    /// Add a cookie to the response
    /// </summary>
    /// <param name="key">The key of the cookie</param>
    /// <param name="value">The value of the cookie</param>
    /// <param name="options">The cookie options</param>
    void SetCookie(string key, string value, CookieOptions options);

    /// <summary>
    /// Set the status code of the response
    /// </summary>
    /// <param name="statusCode">The Status Code according to the Spec</param>
    void SetStatusCode(int statusCode);
}
