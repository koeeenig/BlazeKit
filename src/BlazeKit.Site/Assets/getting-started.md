# 🚀 Getting Started
## ☝️ Requirements
Before creating your first BlazeKit project, you should ensure that your local machine has:
- .NET 7+ - you can find the download [here](https://dotnet.microsoft.com/en-us/download){target="_blank"}

That's it 👍

## ✨ Create an app using the CLI
After you have installed the required dependencies, the easiest way to get a project up an running is by using the BlazeKit CLI.
```shell
# Install the BlazeKit CLI
dotnet tool install --global BlazeKit.CLI --version 0.1.0-alpha.2
```
Now simply create your first BlazeKit project by running the following command
```shell
bkit new NextUnicorn
```
You will be prompted to choose one of the Blazor Hosting Models such as **Blazor WebAssembly** or **Blazor Server**.
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
dotnet tool install -g BlazeKit.CLI --version 0.1.0-alpha.2
```
