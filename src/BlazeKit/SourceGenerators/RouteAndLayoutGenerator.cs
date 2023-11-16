using BlazeKit;
using Microsoft.CodeAnalysis;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace BlazerKit.SourceGenerators
{
    [Generator]
    public sealed class RouteAndLayoutGenerator : ISourceGenerator
    {
        public void Execute(GeneratorExecutionContext context)
        {
            if (!context.AnalyzerConfigOptions.GlobalOptions.TryGetValue("build_property.projectdir", out var projectRoot))
            {
                throw new InvalidOperationException($"Cannot determine project directory");
            }

            var blazeKitDirectory = EnsureBlazeKitDirectory(projectRoot);

            // read blazekit config
            context.AnalyzerConfigOptions.GlobalOptions.TryGetValue("build_property.RootNamespace", out var rootNamespace);
            var config = new Config(Path.Combine(projectRoot, "config.blazekit"));
            var routeParamsRegex = config.Value("routeparams", @"\[\w+\]");
            var output = config.Value("output", fallback: "generated");
            var log = new Log(projectRoot, Boolean.Parse(config.Value("log", "true")));

            LogHead(log);

            // remove generated folder
            if(Directory.Exists(Path.Combine(blazeKitDirectory.FullName, output)))
            {
                log.Info($"🗑️ Removing {Path.Combine(blazeKitDirectory.FullName, output)}");
                Directory.Delete(Path.Combine(blazeKitDirectory.FullName, output), recursive: true);
            }

            //log.Info($"Routes have been modified.. generating Source Files");
            log.Info($"Generating Source Files");

            var razorFiles = context.AdditionalFiles.Where(file => file.Path.EndsWith(".razor"));
            foreach (var razorFile in razorFiles)
            //Parallel.ForEach<AdditionalText>(razorFiles, razorFile =>
            {
                if (new IsUnderRoot(razorFile.Path, root: "pages").Value)
                {
                    var namespaceSegments = rootNamespace + "." + new NamespaceSegments(razorFile.Path, root: "pages").Value;
                    var name = new SanititizedNamespace(Path.GetFileName(razorFile.Path).Replace(".razor", "")).Value;
                    if (IsLayout(razorFile.Path))
                    {
                        log.Info($"📄 {razorFile.Path} is a layout file.");
                        var layout = new ClosestLayout(razorFile.Path, msg => log.Debug(msg), skipSameDirectory: true, root: "pages").Value;
                        var className = "";
                        if (string.IsNullOrEmpty(layout))
                        {
                            log.Error($"Could not find a layout file for {razorFile.Path}");
                        }
                        else
                        {
                            log.Debug($"Found LayoutComponentBase: {namespaceSegments}.{name} for: {layout}");
                            className = $"{rootNamespace}.{layout}";
                        }
                        var generatedLayoutClass = new LayoutClassSource(namespaceSegments, name, className);
                        //write file to blazekit directory
                        var path = new FileInfo(Path.Combine(blazeKitDirectory?.FullName, output, $"{namespaceSegments}.{name}.g.cs"));
                        path.Directory.Create();
                        File.WriteAllText(path.FullName, generatedLayoutClass.Value);
                    }
                    else
                    {
                        var routeSegments = new RouteSegments(razorFile.Path, (msg) => log.Debug(msg), root: "pages", paramRegex: routeParamsRegex).Value;
                        var route = string.Join("/", routeSegments);
                        // route prameters are enclosed in curly braces
                        var parameters = new RouteParameters(routeSegments);
                        // find the namespace of the razor file
                        // the namespace is defined by the file path starting at the root "pages" folder
                        // and ending with the last folder were the razor file is located
                        var layout = new ClosestLayout(razorFile.Path, msg => log.Debug(msg), skipSameDirectory: false, root: "pages").Value;
                        var className = "";
                        if (string.IsNullOrEmpty(layout))
                        {
                            log.Error($"Could not find a layout file for {razorFile.Path}");
                        }
                        else
                        {
                            log.Debug($"Found LayoutComponentBase: {namespaceSegments}.{name} for: {layout}");
                            className = $"{rootNamespace}.{layout}";
                        }
                        var generatedRouteClass = new RouteClassSource(namespaceSegments, name, route, className, parameters.Value.ToArray());
                        // write file to blazekit directory
                        var path = new FileInfo(Path.Combine(blazeKitDirectory?.FullName, output, $"{namespaceSegments}.{name}.g.cs"));
                        path.Directory.Create();
                        File.WriteAllText(path.FullName, generatedRouteClass.Value);
                    }
                }
            }
            //);

            //ProcessMarkdownFiles(context);
        }

        public void Initialize(GeneratorInitializationContext context)
        {
            // Debugger.Launch();
        }

        private DirectoryInfo EnsureBlazeKitDirectory(string projectRoot)
        {
            var blazeKitDirectory = new DirectoryInfo(Path.Combine(projectRoot, ".blazekit"));
            if (!blazeKitDirectory.Exists)
            {
                blazeKitDirectory.Create();
            }
            return blazeKitDirectory;
        }
        private void LogHead(Log log)
        {
            log.Info("##############################");
            log.Info($"🚀 BlazeKit v{this.GetType().Assembly.GetName().Version} alpha 🧪");
            log.Info("##############################");
        }

        private bool IsLayout(string path)
        {
            return Regex.IsMatch(path, @"layout\@*[\(\)\[\]A-Za-z]*.razor", RegexOptions.IgnoreCase);
            //return path.ToLower().Contains("layout");
        }

        private bool RoutesChanged(string projectRoot, string routeRoot, DirectoryInfo blazeKitDirectory)
        {
            var changed = false;
            var routeRootPath = Path.Combine(projectRoot, routeRoot);
            var fileHash = MD5Hash(string.Join(";", Directory.GetFiles(routeRootPath, "*.*", SearchOption.AllDirectories)));

            var hashFile = new FileInfo(Path.Combine(blazeKitDirectory.FullName, ".hash"));
            if (hashFile.Exists)
            {
                //read the content of the hash file
                var hash = File.ReadAllText(hashFile.FullName);
                if (!hash.Equals(fileHash, StringComparison.InvariantCultureIgnoreCase))
                {
                    changed = true;
                }
            }
            else
            {
                changed = true;
            }

            File.WriteAllText(Path.Combine(blazeKitDirectory.FullName, ".hash"), fileHash.ToString());
            return changed;
        }
        public string MD5Hash(string input)
        {
            StringBuilder hash = new StringBuilder();
            MD5CryptoServiceProvider md5provider = new MD5CryptoServiceProvider();
            byte[] bytes = md5provider.ComputeHash(new UTF8Encoding().GetBytes(input));

            for (int i = 0; i < bytes.Length; i++)
            {
                hash.Append(bytes[i].ToString("x2"));
            }
            return hash.ToString();
        }

        //TODO: Stablize markdown support
        //public void ProcessMarkdownFiles(GeneratorExecutionContext context)
        //{
        //    if (!context.AnalyzerConfigOptions.GlobalOptions.TryGetValue("build_property.projectdir", out var projectRoot))
        //    {
        //        throw new InvalidOperationException($"Cannot determine project directory");
        //    }

        //    var blazeKitDirectory = EnsureBlazeKitDirectory(projectRoot);

        //    // read blazekit config
        //    context.AnalyzerConfigOptions.GlobalOptions.TryGetValue("build_property.RootNamespace", out var rootNamespace);
        //    var config = new Config(Path.Combine(projectRoot, "config.blazekit"));
        //    var routeParamsRegex = config.Value("routeparams", @"\[\w+\]");
        //    var output = config.Value("output", fallback: "generated");
        //    var log = new Log(projectRoot, Boolean.Parse(config.Value("log", "true")));

        //    var markdownFiles = new DirectoryInfo(Path.Combine(projectRoot, "Pages")).GetFiles("*.md", SearchOption.AllDirectories);
        //    //var markdownFiles = context.AdditionalFiles.Where(file => file.Path.EndsWith(".md"));

        //    foreach (var markdownFile in markdownFiles)
        //    {
        //        if (new IsUnderRoot(markdownFile.FullName, root: "pages").Value)
        //        {
        //            var namespaceSegments = rootNamespace + "." + new NamespaceSegments(markdownFile.FullName, root: "pages").Value;
        //            var name = new SanititizedNamespace(Path.GetFileName(markdownFile.FullName).Replace(".md", "")).Value;
        //            log.Debug($"📄 {markdownFile.FullName} is a markdown file.");
        //            var routeSegments = new RouteSegments(markdownFile.FullName, (msg) => log.Debug(msg), root: "pages", paramRegex: routeParamsRegex).Value;
        //            var route = string.Join("/", routeSegments);
        //            var parameters = new RouteParameters(routeSegments);
        //            // find closest layout
        //            var layout = new ClosestLayout(markdownFile.FullName, msg => log.Debug(msg), skipSameDirectory: false, root: "pages").Value;
        //            var className = "";
        //            if (string.IsNullOrEmpty(layout))
        //            {
        //                log.Error($"Could not find a layout file for {markdownFile.FullName}");
        //            }
        //            else
        //            {
        //                log.Debug($"Found LayoutComponentBase: {namespaceSegments}.{name} for: {layout}");
        //                className = $"{rootNamespace}.{layout}";
        //            }
        //            // read the markdown file and convert it to html
        //            var markdownAsHtml = Markdig.Markdown.ToHtml(File.ReadAllText(markdownFile.FullName) ?? "", new MarkdownPipelineBuilder().UseAdvancedExtensions().UseEmojiAndSmiley().Build());
        //            markdownAsHtml = markdownAsHtml.Replace("\"", "\"\"");
        //            var generatedPage = new PageFromMarkdownClassSource(namespaceSegments, name, route, className, markdownAsHtml);
        //            // write file to blazekit directory
        //            var path = new FileInfo(Path.Combine(blazeKitDirectory?.FullName, output, $"{namespaceSegments}.{name}.g.cs"));
        //            path.Directory.Create();
        //            File.WriteAllText(path.FullName, generatedPage.Value);
        //        }
        //    }
        //}
    }
}
