using System.Diagnostics.CodeAnalysis;
using System.Reflection.Metadata.Ecma335;
using System.Security.Claims;
using Microsoft.AspNetCore.Http.Features;

namespace BlazeKit.Routing.TestApp;

public class CustomHttpResponse : HttpResponse
{
    private HttpResponse originalResponse;
    private Stream ms;

    public CustomHttpResponse(HttpResponse originalResponse)
    {
        this.originalResponse = originalResponse;
        this.ms = new MemoryStream();
    }
    public override HttpContext HttpContext => this.originalResponse.HttpContext;

    public override int StatusCode { get => this.originalResponse.StatusCode; set => this.originalResponse.StatusCode = value; }

    public override IHeaderDictionary Headers => this.originalResponse.Headers;

    public override Stream Body { get => this.ms; set => this.ms = value; }
    public override long? ContentLength { get => this.originalResponse.ContentLength; set => this.originalResponse.ContentLength = value; }
    public override string? ContentType { get => this.originalResponse.ContentType; set => this.originalResponse.ContentType = value; }

    public override IResponseCookies Cookies => this.originalResponse.Cookies;

    public override bool HasStarted => this.originalResponse.HasStarted;

    public override void OnCompleted(Func<object, Task> callback, object state)
    {
        this.originalResponse.OnCompleted(callback, state);
    }

    public override void OnStarting(Func<object, Task> callback, object state)
    {
        this.originalResponse.OnStarting(callback, state);
    }

    public override void Redirect([StringSyntax("Uri")] string location, bool permanent)
    {
        this.originalResponse.Redirect(location, permanent);
    }
}

public class CustomHttpContext : HttpContext
{
    private readonly HttpContext originalContext;
    private readonly CustomHttpResponse response;

    public CustomHttpContext(HttpContext originalContext)
    {
        this.originalContext = originalContext;
        this.response = new CustomHttpResponse(originalContext.Response);

    }
    public override IFeatureCollection Features => this.originalContext.Features;

    public override HttpRequest Request => this.originalContext.Request;

    public override HttpResponse Response => this.response;

    public override ConnectionInfo Connection => this.originalContext.Connection;

    public override WebSocketManager WebSockets => this.originalContext.WebSockets;

    public override ClaimsPrincipal User { get => this.originalContext.User; set => this.originalContext.User = value; }
    public override IDictionary<object, object?> Items { get => this.originalContext.Items; set => this.originalContext.Items = value; }
    public override IServiceProvider RequestServices { get => this.originalContext.RequestServices; set => this.originalContext.RequestServices = value; }
    public override CancellationToken RequestAborted { get => this.originalContext.RequestAborted; set => this.originalContext.RequestAborted = value; }
    public override string TraceIdentifier { get => this.originalContext.TraceIdentifier; set => this.originalContext.TraceIdentifier = value; }
    public override ISession Session { get => this.originalContext.Session; set => this.originalContext.Session = value; }

    public override void Abort()
    {
        this.originalContext.Abort();
    }
}
