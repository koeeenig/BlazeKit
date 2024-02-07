// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System.Diagnostics;
using System.Globalization;
using BlazeKit.Reactivity;
using BlazeKit.Reactivity.Signals;
using BlazeKit.Web.Utils;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;
using Microsoft.AspNetCore.Components.Routing;
using Microsoft.AspNetCore.Components.Web;
namespace BlazeKit.Web.Components;

/// <summary>
/// A component that renders an anchor tag, automatically toggling its 'active'
/// class based on whether its 'href' matches the current URI.
/// </summary>

public class Link2 : IComponent
{

    private ISignal<int> counter = Signal.New(0);
    private RenderHandle renderHandle;
    private string markup = "";
    private string prerenderId = Guid.NewGuid().ToString();
    private string locationhash = Guid.NewGuid().ToString();

    public Link2()
    {
        //if(OperatingSystem.IsBrowser())
        //{
        //    Task.Run(async () =>
        //    {
        //        while(true)
        //        {
        //            counter.Value++;
        //            await Task.Delay(1000);
        //        }
        //    });
        //}
    }

    public void Attach(RenderHandle renderHandle)
    {
        this.renderHandle = renderHandle;
        new Effect(() =>
        {
            markup = @$"
                    <h1>Hello counter {counter.Value}</h1>
                    <button class=""btn"">Increment</button>
                ";
            //this.renderHandle.Render(Render);

        });
    }

    public Task SetParametersAsync(ParameterView parameters)
    {
        renderHandle.Render(Render);

        return Task.CompletedTask;
    }

    private void Render(RenderTreeBuilder builder)
    {
        builder.OpenElement(0, "div");
        builder.AddAttribute(1,"blazekit-id", prerenderId);
        builder.AddAttribute(2, "client", "hover");
        builder.AddMarkupContent(3, OpenWasmComponent());
        builder.AddContent(4,(MarkupString)this.markup);
        builder.AddMarkupContent(5, CloseWasmComponent());
        builder.CloseElement();
    }

    private string OpenWasmComponent()
    {
        var typeName = this.GetType().FullName;
        var assemblyName = $"{this.GetType().Assembly.GetName().Name}";
        return @$"<!--Blazor:{{""type"":""webassembly"",""prerenderId"":""{prerenderId}"",""key"":{{""locationHash"":""{locationhash}"",""formattedComponentKey"":""""}},""assembly"":""{assemblyName}"",""typeName"":""{typeName}"",""parameterDefinitions"":""W10="",""parameterValues"":""W10=""}}-->";
    }

    private string CloseWasmComponent()
    {
        return @$"<!--Blazor:{{""prerenderId"":""{prerenderId}""}}-->";
    }
}
