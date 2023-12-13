// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Endpoints.Infrastructure;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Microsoft.AspNetCore.Builder;

public static class BlazorWebAssemblyExtensions
{
    public static IEndpointRouteBuilder UseBlazorWebAssemblyRenderMode(this IEndpointRouteBuilder endpointRouteBuilder)
    {        
        ArgumentNullException.ThrowIfNull(endpointRouteBuilder);

        string? pathPrefix = null; // wasmWithOptions.EndpointOptions?.PathPrefix;

        var applicationBuilder = endpointRouteBuilder.CreateApplicationBuilder();

        applicationBuilder.UseBlazorFrameworkFiles(pathPrefix ?? default);
        var app = applicationBuilder.Build();

        endpointRouteBuilder.Map($"{pathPrefix}/_framework/{{*path}}", context =>
        {
            // Set endpoint to null so the static files middleware will handle the request.
            context.SetEndpoint(null);

            return app(context);
        });

        return endpointRouteBuilder;
    }
}