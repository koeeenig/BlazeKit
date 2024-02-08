using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlazeKit.Web;

internal interface IPageLoad<TPageData>
{
    virtual Task<TPageData> ServerLoadAsync() => Task.FromResult(default(TPageData));
}
