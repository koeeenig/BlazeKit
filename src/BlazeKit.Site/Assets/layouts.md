### (Group)
Perhaps you have some routes that are 'App' routes that should have one layout (e.g. /dashboard or /item), and others that are 'Marketing' routes that should have a different layout (/about or /testimonials). We can group these routes with a directory whose name is wrapped in parentheses — unlike normal directories, (App) and (Marketing) do not affect the URL pathname of the routes inside them:
```
Pages/
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

### Breaking out of Layouts
Breaking out of layoutspermalink
The root layout applies to every page of your app — if omitted, it defaults to <slot />. If you want some pages to have a different layout hierarchy than the rest, then you can put your entire app inside one or more groups except the routes that should not inherit the common layouts.

In the example above, the /admin route does not inherit either the (app) or (marketing) layouts.

+page@permalink
Pages can break out of the current layout hierarchy on a route-by-route basis. Suppose we have an /item/[id]/embed route inside the (app) group from the previous example:
```
Pages/
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
Ordinarily, this would inherit the root layout, the (app) layout, the item layout and the [id] layout. We can reset to one of those layouts by appending @ followed by the segment name — or, for the root layout, the empty string. In this example, we can choose from the following options:

- Page@[id].razor - inherits from Pages/(App)/Item/[id]/Layout.razor
- Page@item.razor - inherits from Pages/(App)/Item/Layout.razor
- Page@(app).razor - inherits from Pages/(App)/Layout.razor
- Page@.razor - inherits from Pages/Layout.razor

```
Pages/
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
Like pages, layouts can themselves break out of their parent layout hierarchy, using the same technique. For example, a +layout@.svelte component would reset the hierarchy for all its child routes.
```
Pages/
├ (App)/
│ ├ Item/
│ │ ├ [Id]/
│ │ │ ├ Embed/
│ │ │ │ └ Page.razor  // uses (App)/Item/[Id]/Layout.razor
│ │ │ ├ Layout.razor  // inherits from (App)/Item/Layout@.razor
│ │ │ └ Page.razor    // uses (App)/Item/Layout@.razor
│ │ └ Layout.razor   // inherits from root layout, skipping (App)/Layout.razor
│ └ Layout.razor
└ Layout.razor
```
