# BlazeKit - A Meta-Framework for Blazor .NET

**BlazeKit** provides Meta-framework-like features for Blazor which has been inspired by [SvelteKit](https://kit.svelte.dev/). BlazeKit currently supports the following set of features:

- 🪧 File-based Routing
- 🖼️ File-based Layouts
- 🤝 File-based API Routes
- 🪄 Auto-Generated Route Parameters
- 📝  Build in Markdown Support for Page Routesa
- ⚡ Reactive primitives inspired by the signals pattern.

> 💡 BlazeKit is unopinionated about the Blazor Hosting Model. BlazeKit works with either **Blazor WebApp** or **Blazor WebAssembly**.

# 🚀 Getting Started
## ☝️ Requirements
Before creating your first BlazeKit project, you should ensure that your local machine has:
- .NET 8 - you can find the download [here](https://dotnet.microsoft.com/en-us/download)

That's it 👍

## ✨ Create an app using the CLI
After you have installed the required dependencies, the easiest way to get a project up an running is by using the BlazeKit CLI.
```shell
# Install the BlazeKit CLI
dotnet tool install --global BlazeKit.CLI
```
Now simply create your first BlazeKit project by running the following command
```shell
bkit new NextUnicorn
```
You will be prompted to choose one of the Blazor Hosting Models such as **Blazor WebAssembly** or **Blazor WebApp**.
Afterwards a BlazeKit app will be created with the choosen hosting model.
Next **_cd_** into your project folder and start .NET's local development server using the **_dotnet watch_** command
```shell
cd NextUnicorn
dotnet watch
```
And here it is, your first BalzeKit project 🎉

## 🔄️ Updating the BlazeKit CLI
The easiest way to update the BlazeKit CLI is to simply uninstall and reinstall it.
```shell
dotnet tool uninstall -g BlazeKit.CLI
dotnet tool install -g BlazeKit.CLI
```
