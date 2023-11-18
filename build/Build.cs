using System;
using System.Collections.Generic;
using System.Linq;
using Nuke.Common;
using Nuke.Common.CI;
using Nuke.Common.CI.GitHubActions;
using Nuke.Common.Execution;
using Nuke.Common.Git;
using Nuke.Common.IO;
using Nuke.Common.ProjectModel;
using Nuke.Common.Tooling;
using Nuke.Common.Tools.DotNet;
using Nuke.Common.Utilities.Collections;
using Octokit;
using static Nuke.Common.EnvironmentInfo;
using static Nuke.Common.IO.FileSystemTasks;
using static Nuke.Common.IO.PathConstruction;

[GitHubActions(
    "build",
    GitHubActionsImage.UbuntuLatest,
    On = new[] { GitHubActionsTrigger.Push },
    ImportSecrets = new[] { nameof(NuGetApiKey) },
    InvokedTargets = new[] { nameof(Publish) })]
class Build : NukeBuild
{
    /// Support plugins are available for:
    ///   - JetBrains ReSharper        https://nuke.build/resharper
    ///   - JetBrains Rider            https://nuke.build/rider
    ///   - Microsoft VisualStudio     https://nuke.build/visualstudio
    ///   - Microsoft VSCode           https://nuke.build/vscode

    public static int Main () => Execute<Build>(x => x.Publish);

    [Parameter("Configuration to build - Default is 'Debug' (local) or 'Release' (server)")]
    readonly Configuration Configuration = IsLocalBuild ? Configuration.Debug : Configuration.Release;

    [GitRepository] readonly GitRepository Repository;

    [Parameter] [Secret] readonly string NuGetApiKey;

    readonly AbsolutePath SourceDirectory = RootDirectory / "src";
    readonly AbsolutePath TestsDirectory = RootDirectory / "tests";
    readonly AbsolutePath OutputDirectory = RootDirectory / "artifacts";

    [Solution] readonly Solution Solution;

    Target Clean => _ => _
        .Executes(() =>
        {
                OutputDirectory.CreateOrCleanDirectory();
        });

    Target Restore => _ => _
        .DependsOn(Clean)
        .Executes(() =>
        {
            foreach (var project in Solution.GetAllProjects("BlazeKit.*"))
            {
                DotNetTasks
                    .DotNetRestore(s => s
                        .SetProjectFile(project)
                    );
            }

        });

    Target Compile => _ => _
        .DependsOn(Restore)
        .Executes(() =>
        {
            var projectsToBuild =
                new List<Nuke.Common.ProjectModel.Project>() {
                    Solution.GetProject("BlazeKit"),
                    Solution.GetProject("BlazeKit.Reactive"),
                    Solution.GetProject("BlazeKit.CLI")
                    // Solution.GetProject("BlazeKit.Deployment.Vercel")
                };
             foreach (var project in projectsToBuild)
            {
                DotNetTasks
                    .DotNetBuild(s => s
                        .SetProjectFile(project)
                        .SetConfiguration(Configuration)
                    );
            }
        });

    Target Test => _ => _
        .DependsOn(Compile)
        .Executes(() =>
        {
            foreach (var project in Solution.AllProjects.Where(p => p.Name.EndsWith(".Tests")))
            {
                DotNetTasks
                    .DotNetTest(s => s
                        .SetProjectFile(project)
                        .SetConfiguration(Configuration)
                    );
            }
        });

    Target Pack => _ => _
        .DependsOn(Test)
        .Produces(OutputDirectory / "*.nupkg")
        .Executes(() =>
        {
            var projectsToPack =
                new List<Nuke.Common.ProjectModel.Project>() {
                    Solution.GetProject("BlazeKit"),
                    Solution.GetProject("BlazeKit.Reactive"),
                    Solution.GetProject("BlazeKit.CLI")
                    // Solution.GetProject("BlazeKit.Deployment.Vercel")
                };
            foreach (var project in projectsToPack)
            {
                DotNetTasks
                    .DotNetPack(s => s
                        .SetProject(project)
                        .SetNoBuild(true)
                        .SetConfiguration(Configuration)
                        .SetOutputDirectory(OutputDirectory)
                    );
            }
        });

    Target Publish => _ => _
        .DependsOn(Pack)
        .OnlyWhenDynamic(() => IsServerBuild && Repository.IsOnMainBranch())
        .Executes(() => {

            // extract the version from a single project and check if it is part of the repository tags
            // if so, publish the packages to nuget.org
            var version = Solution.GetProject("BlazeKit").GetProperty("Version");

            if(!Repository.Tags.Contains(version, StringComparer.OrdinalIgnoreCase)) {
                Serilog.Log.Warning($"Version {version} is not a tag in the repository. Skipping publish.");
                return;
            } else {
                Serilog.Log.Information($"Version {version} is a tag in the repository. Publishing.");
                // get all nupkg files in output folder
                var packages = OutputDirectory.GetFiles("*.nupkg");
                // push each package to nuget.org
                packages.ForEach(package => {
                    DotNetTasks
                        .DotNetNuGetPush(s => s
                            .SetSource("https://api.nuget.org/v3/index.json")
                            .SetApiKey(NuGetApiKey)
                            .SetTargetPath(package)
                        );
                });
            }
        });
}
