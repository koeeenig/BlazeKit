using Microsoft.AspNetCore.Components.RenderTree;
using Microsoft.AspNetCore.Components.Web.HtmlRendering;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Runtime.ExceptionServices;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.HtmlRendering.Infrastructure;

namespace BlazeKit.Static;

/// <summary>
/// A <see cref="Renderer"/> subclass that is intended for static HTML rendering. Application
/// developers should not normally use this class directly. Instead, use
/// <see cref="HtmlRenderer"/> for a more convenient API.
/// </summary>
#pragma warning disable BL0006 // Do not use RenderTree types
public partial class BKStaticHtmlRenderer : StaticHtmlRenderer
{
    public BKStaticHtmlRenderer(IServiceProvider serviceProvider, ILoggerFactory loggerFactory) : base(serviceProvider,loggerFactory)
    {
        
    }
    protected override IComponent ResolveComponentForRenderMode([DynamicallyAccessedMembers((DynamicallyAccessedMemberTypes)(-1))] Type componentType, int? parentComponentId, IComponentActivator componentActivator, IComponentRenderMode renderMode)
       => renderMode switch
       {
           InteractiveWebAssemblyRenderMode => componentActivator.CreateInstance(componentType),
           _ => throw new NotSupportedException($"Cannot create a component of type '{componentType}' because its render mode '{renderMode}' is not supported by BlazeKit rendering."),
       };
}
#pragma warning restore BL0006 // Do not use RenderTree types
