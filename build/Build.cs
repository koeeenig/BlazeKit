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
             foreach (var project in Solution.GetAllProjects("BlazeKit.*"))
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
                        .SetNoBuild(true)
                        .SetConfiguration(Configuration)
                    );
            }
        });

    Target Pack => _ => _
        .DependsOn(Test)
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
        .OnlyWhenDynamic(() => IsServerBuild)
        .Executes(() => {

        });
}