# BlazeKit - A Meta-Framework for Blazor .NET

**⚠️ BlazeKit is work in progress**

BlazeKit aims to provide Meta-framework-like Features for Blazor which has been inspired by [SvelteKit](https://kit.svelte.dev). BlazeKit currently supports the following features:</p>
- ⚡ Reactive primitives inspired by the signals pattern.
- 🪧 File-based Routing
- 🖼️ File-based Layout Inheritance
- 🪄 Auto-Generated Route Parameters

Some more infos can be found at [blazekit.dev](https://blazekit.dev) but keep in mind BlazeKit is work in progress.

# 🚀 Getting Started
Before creating your first BlazeKit project, you should ensure that your local machine has:
- .NET 8 - you can find the download [here](https://dotnet.microsoft.com/en-us/download)

That's it 👍

## ✨ Create an app using the CLI
After you have installed the required dependencies, the easiest way to get a project up an running is by using the BlazeKit CLI.
```ps
# Install the BlazeKit CLI
dotnet tool install --global BlazeKit.CLI --version 0.1.0-alpha.2
```
Now simply create your first BlazeKit project by running the following command
```ps
bkit new NextUnicorn
```
You will be prompted to choose one of the Blazor Hosting Models such as **Blazor WebAssembly** or **Blazor Server**.
Afterwards a BlazeKit app will be created with the choosen hosting model.
Next **_cd_** into your project folder and start .NET's local development server using the **_dotnet watch_** command
```ps
cd NextUnicorn
dotnet watch
```
And here it is, your first BalzeKit project 🎉

## 🔄️ Updating the BlazeKit CLI
The easiest way to update the BlazeKit CLI is to simply uninstall and reinstall it.
```ps
dotnet tool uninstall -g BlazeKit.CLI
dotnet tool install -g BlazeKit.CLI --version 0.1.0-alpha.2
```
