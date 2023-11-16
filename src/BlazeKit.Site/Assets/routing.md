# 🪧 File-based Routing
The routing in BlazeKit is based on the filesystem. Each route is represented by a folder which contains a `Page.razor` file.
The folder structure is used to define the route of the page. For example the following folder structure:
```
Pages/
├ About/
│ └ Page.razor
└ Page.razor
```
will result in the following routes:
- `/`
- `/about`

## Route Parameters
Route parameters can be defined by adding a file with the name of the parameter to the folder.
For example the following folder structure:
```
Pages/
├ About/
│ └ Page.razor
├ Project/
│ └ [Id]/
│   └ Page.razor
└ Page.razor
```
will result in the following routes:
- `/`
- `/about`
- `/project/{id}`

BlazeKit will generate a class with the name of the parameter which can be used to access the parameter value.
In the above example the `Id` parameter can be accessed in the `Pages/Project/[Id]/Page.razor` file by `Id` property.
```html
<h1>Project Id: @Id</h1>
```

