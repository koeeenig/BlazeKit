---
title: Loading Data - Docs - BlazeKit
category: Core Concepts
draft: false
slug: loading-data
---
# Loading Data

Before a `Page.razor` is rendered, we often need to load data. To load data on the server a `Page.razor` inherits from `PageComponentBase` an overrides `ServerLoadAsync` method. This method get's called when the page is first loaded but has not been rendered yet.

## Page Data
A `Page.razor` which inherits from `PageComponentBase` is able to override `ServerLoadAsync` to load data on the server before the page get's rendered. The return type of the method is the data you want to make available to the page and the components used inside the page. The loaded data is defined as a **CascadingValue** named `PageData` which makes it available to component used in the page.
```razor
@inherits PageComponentBase<MyPageData>
@code {

    // Define the data to be loaded
    public class MyPageData : PageDataBase
    {
        public string Title { get; set; }
    }

    protected override async Task<MyPageData> ServerLoadAsync(Uri route, Response? response)
    {
        // Load data here
        var data = await myService.GetData()
        // Further manipulate the data if required and return it
        return data;
    }
}

<h1>@PageData.Title</h1>
```

The `PageData` property is a **CascadingValue** that makes the loaded data available to the page and the components used inside the page. The `PageData` property is defined in the `PageComponentBase` class and is of type `PageDataBase`. The `PageDataBase` class is a base class for the data to be loaded.

Inside the `ServerLoadAsync` method, you can load data from a database, a web service, or any other source. The method is called on the server and is not available on the client. The method is called when the page is first loaded but has not been rendered yet. The method is called with the route of the page and the response of the corresponding request.

<div class="tip">
<p>Tip</p>
<p>To make it even more clear that this method is executes on the server you can create a file <code>Page.Server.cs</code> next to <code>Page.razor</code> and implement a partial class <code>Page</code> which inherits from <code>PageComponentBase</code> and override the <code>ServerLoadAsnc</code> in there.</p>
</div>

# Using URL Data
BlazeKit ships with Extensions methods for `Uri` to retrieve the route parameters. The `Uri` extension method `Param(string name, string fallback)` can be used to retrieve a query parameter from the route. If the parameter with the given name does not exists, the fallback value is returned. If no fallback value is provided a `InvalidOperationException` is thrown.

```razor
@inherits PageComponentBase<MyPageData>
@using BlazeKit.Web.Utils

@code
{
    public class MyPageData : PageDataBase
    {
        public string Id { get; set; }
        public IList<string> Titles { get; set; }
    }

    protected override async Task<MyPageData> ServerLoadAsync(Uri route, Response? response)
    {
        var id = route.Param("id", "0");
        var titles = await myService.GetData(id);
        return
            new MyPageData() {
                Id = id,
                Titles = titles
            };
    }
}
<h1>@PageData.Title</h1>
<p>ID: @PageData.Id</p>
```
## Headers
The `Response` class represents the response of the request. The `Response` class is a wrapper around the `HttpResponse` class and provides a way to access the response of the request. The `Response` class is only available on the server and is not available on the client. The `Response` class is used to modify the response to e.g. add http headers, cookies, or to set the status code of the response. The folling example adds a cache control header to the response.

```razor

@inherits PageComponentBase<MyPageData>
@code
{
    public class MyPageData : PageDataBase
    {
        public string Title { get; set; }
    }

    protected override async Task<MyPageData> ServerLoadAsync(Uri route, Response? response)
    {
        response.SetHeader("Cache-Control", "public, max-age=120");
        return new MyPageData() {
            Title = "Hello World"
        };
    }
}
```
Sometimes you need to redirect from one page to another. You can do this by returning a `Redirect` response from the `ServerLoadAsync` method. The `Redirect` method is used to redirect the client to another page by setting the status code of the response to 301 or 302 and by setting the location header of the response to the url of the page to redirect to.

> The `Redirect` method returns null. The `PageComponentBase` checks the status code of the response after the `ServerLoadAsync` has been called. Therefor it is recommanded to immediately call return after the call to `response.Redirect` to avoid unnecessary data fetching.

```razor
@inherits PageComponentBase<MyPageData>
@code
{
    public class MyPageData : PageDataBase
    {
        public string Title { get; set; }
    }

    protected override async Task<MyPageData> ServerLoadAsync(Uri route, Response? response)
    {
        // Redirect to another page
        // and immediately return to avoid unnecessary data fetching
        return new response.Redirect("/another-page");

        // This code is not executed
        var id = route.Param("id", "0");
        var data = await myService.GetData(id);
        return data;
    }
}
```
If you need to set headers or cookies in pages authored with `Page.md` you can do this as well. Co-locate a `Page.cs` file with the `Page.md` file and implement a partial class `Page` which inherits from `PageComponentBase`. The `Page` class is used to set headers or cookies in the response of the request. The `Page` class is only available on the server and is not available on the client. The following example adds a cache control header to the response.

```csharp
using BlazeKit.Web.Components;

public partial class Page : PageComponentBase<PageDataBase>
{
    protected override async Task ServerLoadAsync(Uri route, Response? response)
    {
        response.SetHeader("Cache-Control", "public, max-age=120");
    }
}
```
# Cookies
Just like headers, the `Response` class is used to set cookies in the response of the request. The following example adds a cookie to the response.

```razor
@inherits PageComponentBase<MyPageData>
@code
{
    public class MyPageData : PageDataBase
    {
        public string Title { get; set; }
    }

    protected override async Task<MyPageData> ServerLoadAsync(Uri route, Response? response)
    {
        response.SetCookie("name", "value");
        return new MyPageData() {
            Title = "Hello World"
        };
    }
}
```
