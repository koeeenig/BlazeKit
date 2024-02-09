using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlazeKit.Static;

/// <summary>
/// A <see cref="HttpResponse"/> implementation for static site generation purposes"/>
/// </summary>
internal class FkHttpResponse : HttpResponse
{
    private readonly HttpContext ctx;

    /// <summary>
    /// A <see cref="HttpResponse"/> implementation for static site generation purposes"/>
    /// </summary>
    public FkHttpResponse(HttpContext ctx)
    {
        this.ctx = ctx;
    }
    public override HttpContext HttpContext => this.ctx;

    public override int StatusCode { get; set; }

    public override IHeaderDictionary Headers => new HeaderDictionary();

    public override Stream Body { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
    public override long? ContentLength { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
    public override string? ContentType { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }

    public override IResponseCookies Cookies => new FkResponseCookies();

    public override bool HasStarted => throw new NotImplementedException();

    public override void OnCompleted(Func<object, Task> callback, object state)
    {
        throw new NotSupportedException();
    }

    public override void OnStarting(Func<object, Task> callback, object state)
    {
        throw new NotSupportedException();
    }

    public override void Redirect([StringSyntax("Uri")] string location, bool permanent)
    {
        throw new NotSupportedException("'Redirect' is not supported in Static Site Generation");
    }
}
