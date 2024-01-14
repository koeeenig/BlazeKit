# 🖼️ File-based Layouts
**BlazeKit** uses a file-based layout convention which is inspired by [SvelteKit](https/kit.svelte.dev). Again a huge shoutout to the svelte Team for the inspiration.

<div>
<!--Blazor:{"type":"webassembly","prerenderId":"a6352c03-e287-4367-b7b0-3252740b1477","key":{"locationHash":"cf243a98-9ca6-450a-8723-f31a73a08cc5","formattedComponentKey":""},"assembly":"BlazeKit.Website.Islands","typeName":"BlazeKit.Website.Islands.Components.Counter","parameterDefinitions":"W10=","parameterValues":"W10="}-->
<BlazeKit.Website.Islands.Components.BlzIsland ComponentType="@(typeof(BlazeKit.Website.Islands.Components.Counter))">
    <BlazeKit.Website.Islands.Components.Counter />
</BlazeKit.Website.Islands.Components.BlzIsland>
<!--Blazor:{"prerenderId":"a6352c03-e287-4367-b7b0-3252740b1477"}-->
</div>

## Layout nesting
Similar to the file-based routing, a layout can be defined in a folder by adding `Layout.razor` file.
This file **needs to inherit** from **`LayoutComopentBase`**
```razor
@* Layout.razor file *@
@inherits LayoutComponentBase
@Body
```
A layout will inherit from the closest layout found up the folder tree. In this example, the About/Page.razor file will inherit the Layout from `About/Layout.razor`.  The `About/Layout.razor` file will inherit the layout from the Layout file at the root of the Routes folder which is `Routes/Layout.razor`.


```none
Routes/
│ About/
│ ├ Page.razor
│ └ Layout.razor
├ Page.razor
└ Layout.razor
```
## (Group)
Perhaps you have some routes that are 'App' routes that should have one layout (e.g. /dashboard or /item), and others that are 'Marketing' routes that should have a different layout (/about or /testimonials). We can group these routes with a directory whose name is wrapped in parentheses — unlike normal directories, (App) and (Marketing) do not affect the URL pathname of the routes inside them:
```none
Routes/
│ (App)/
│ ├ Dashboard/Page.razor
│ ├ Item/Page.razor
│ └ Layout.razor
│ (Marketing)/
│ ├ About/Page.razor
│ ├ Testimonials/Page.razor
│ └ Layout.razor
├ Admin/Page.razor
└ Layout.razor
```

## Breaking out of layouts
The root layout applies to every page of your app. If you want some pages to have a different layout hierarchy than the rest, then you can put your entire app inside one or more groups except the routes that should not inherit the common layouts.

In the example above, the /Admin route does not inherit either the (App) or (Marketing) layouts.

### Page@
Pages can break out of the current layout hierarchy on a route-by-route basis. Suppose we have an /Item/[id]/Embed route inside the (App) group from the previous example:
```none
Routes/
├ (App)/
│ ├ Item/
│ │ ├ [Id]/
│ │ │ ├ Embed/
│ │ │ │ └ Page.razor
│ │ │ └ Layout.razor
│ │ └ Layout.razor
│ └ Layout.razor
└ Layout.razor
```
Ordinarily, this would inherit the root layout, the **(App) layout**, the **item layout** and the **[Id] layout**. We can reset to one of those layouts by appending @ followed by the segment name — or, for the root layout, the empty string. In this example, we can choose from the following options:

- Page@[Id].razor - inherits from Routes/(App)/Item/[id]/Layout.razor
- Page@Item.razor - inherits from Routes/(App)/Item/Layout.razor
- Page@(App).razor - inherits from Routes/(App)/Layout.razor
- Page@.razor - inherits from Routes/Layout.razor

```none
Routes/
├ (App)/
│ ├ Item/
│ │ ├ [Id]/
│ │ │ ├ Embed/
│ │ │ │ └ Page@(App).razor
│ │ │ └ Layout.razor
│ │ └ Layout.razor
│ └ Layout.razor
└ Layout.razor
```
## Layout@

Like pages, layouts can themselves break out of their parent layout hierarchy, using the same technique. For example, a Layout@.razor component would reset the hierarchy for all its child routes.
```none
Routes/
├ (App)/
│ ├ Item/
│ │ ├ [Id]/
│ │ │ ├ Embed/
│ │ │ │ └ Page.razor  // uses (App)/Item/[Id]/Layout.razor
│ │ │ ├ Layout.razor  // inherits from (App)/Item/Layout@.razor
│ │ │ └ Page.razor    // uses (App)/Item/Layout@.razor
│ │ └ Layout@.razor   // inherits from root layout, skipping (App)/Layout.razor
│ └ Layout.razor
└ Layout.razor
```
