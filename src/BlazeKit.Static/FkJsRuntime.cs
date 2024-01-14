using System.Diagnostics.CodeAnalysis;
using Microsoft.JSInterop;

namespace BlazeKit.Static;
public sealed class FkJsRuntime : IJSRuntime
{
    public ValueTask<TValue> InvokeAsync<[DynamicallyAccessedMembers(DynamicallyAccessedMemberTypes.PublicConstructors | DynamicallyAccessedMemberTypes.PublicFields | DynamicallyAccessedMemberTypes.PublicProperties)] TValue>(string identifier, object?[]? args)
    {
        throw new NotSupportedException("Javascript Runtime is not valid in Static Site Generation");
    }

    public ValueTask<TValue> InvokeAsync<[DynamicallyAccessedMembers(DynamicallyAccessedMemberTypes.PublicConstructors | DynamicallyAccessedMemberTypes.PublicFields | DynamicallyAccessedMemberTypes.PublicProperties)] TValue>(string identifier, CancellationToken cancellationToken, object?[]? args)
    {
        throw new NotSupportedException("Javascript Runtime is not valid in Static Site Generation");
    }
}
