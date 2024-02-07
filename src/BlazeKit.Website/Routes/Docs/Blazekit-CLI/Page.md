# BlazeKit CLI
## Introduction
BlazeKit provides a CLI tool to create and build projects.
## Install
```sh
# Install the BlazeKit CLI
dotnet tool install --global BlazeKit.CLI
```
## Update
The easiest way to update the BlazeKit CLI is to simply uninstall and reinstall it.
```sh
# Update the BlazeKit CLI
dotnet tool uninstall -g BlazeKit.CLI
dotnet tool install -g BlazeKit.CLI
```
## Create a Project
```sh
bkit new NextUnicorn
```
You will be prompted to choose one of the Blazor Hosting Models such as **Blazor WebAssembly** or **Blazor WebApp**.
Afterwards a BlazeKit app will be created with the choosen hosting model.
Next **_cd_** into your project folder and start .NET's local development server using the **_dotnet watch_** command
```sh
cd NextUnicorn
bkit run dev
```
And here it is, your first BalzeKit project 🎉

## Build
Building the is handled by the CLI as well.
```sh
bkit build
```
The default build output directoy is `.blazekit/build`. You can customize the ouput with the `-o` option.
```sh
bkit build -o ./artifacts/static
```
This will build the app into the `./artifacts/static` directory

## Integrations
### TailwindCSS
```sh
bkit add tailwindcss
```
This creates a `tailwind.config.js` file in the current project directory with some default settings. You can customize the configuration if you need to but in most cases you will leave it as is.


