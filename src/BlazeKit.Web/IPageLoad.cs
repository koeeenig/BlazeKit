using Microsoft.AspNetCore.Http;

namespace BlazeKit.Web;

internal interface IPageLoad<TPageData>
{
    virtual Task<TPageData> ServerLoadAsync(Uri route, HttpContext? context) => Task.FromResult(default(TPageData));
}
