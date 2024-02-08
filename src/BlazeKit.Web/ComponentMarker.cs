using Microsoft.AspNetCore.Components;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace BlazeKit.Web;

#nullable enable

internal struct ComponentMarker
{
    public const string WebAssemblyMarkerType = "webassembly";

    // The marker type. Can only be "webassembly" since we do not want to rely on a websocket connection.
    public string? Type { get; set; }

    // A string to allow the clients to differentiate between prerendered
    // and non prerendered components and to uniquely identify start and end
    // markers in prererendered components.
    // The value will be null if this marker represents a non-prerendered component.
    public string? PrerenderId { get; set; }

    // The assembly containing the component type.
    public string? Assembly { get; set; }

    // The full name of the component type.
    public string? TypeName { get; set; }

    // Serialized definitions of the component's parameters.
    public string? ParameterDefinitions { get; set; }

    // Serialized values of the component's parameters.
    public string? ParameterValues { get; set; }

    public ComponentMarker(Type type, ParameterView parameters)
    {
        PrerenderId = Guid.NewGuid().ToString("N");
        var (definitions, values) = ComponentParameter.FromParameterView(parameters);
        Assembly = type.Assembly.GetName().Name ?? throw new InvalidOperationException("Cannot prerender components from assemblies with a null name");
        TypeName = type.FullName ?? throw new InvalidOperationException("Cannot prerender component types with a null name");
        ParameterDefinitions = Convert.ToBase64String(JsonSerializer.SerializeToUtf8Bytes(definitions, WebAssemblyComponentSerializationSettings.JsonSerializationOptions));
        ParameterValues = Convert.ToBase64String(JsonSerializer.SerializeToUtf8Bytes(values, WebAssemblyComponentSerializationSettings.JsonSerializationOptions));
    }

    public string ToStartMarker()
    {
        var typeName = this.TypeName;
        var assemblyName = this.Assembly;
        var prerenderId = this.PrerenderId;
        var locationhash = Guid.NewGuid().ToString();
        var paramDefinitions = ParameterDefinitions;
        var paramValues = ParameterValues;
        //TODO: This is ugly an not good maintainable. This should probably be a record class or a struct which represents the JSON
        return @$"<!--Blazor:{{""type"":""webassembly"",""prerenderId"":""{prerenderId}"",""key"":{{""locationHash"":""{locationhash}"",""formattedComponentKey"":""""}},""assembly"":""{assemblyName}"",""typeName"":""{typeName}"",""parameterDefinitions"":""{paramDefinitions}"",""parameterValues"":""{paramValues}""}}-->";
    }

    public string ToEndMarker()
    {
        return @$"<!--Blazor:{{""prerenderId"":""{this.PrerenderId}""}}-->";
    }

    /// <summary>
    /// Serialization options for the WASM marker
    /// </summary>
    internal static class WebAssemblyComponentSerializationSettings
    {
        public static readonly JsonSerializerOptions JsonSerializationOptions =
            new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                PropertyNameCaseInsensitive = true,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
            };
    }
}
