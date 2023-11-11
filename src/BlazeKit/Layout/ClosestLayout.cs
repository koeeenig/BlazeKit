using Microsoft.CodeAnalysis.CSharp.Syntax;
using System;
using System.IO;
using System.Linq;

namespace BlazeKit
{
    public sealed class ClosestLayout : Lazy<string>
    {
        // Regex pattern
        private static string namespacePattern = @"@namespace\s+(\S+)";
        public ClosestLayout(string file, Action<string> log, bool skipSameDirectory = false, string root = "pages") : base(() =>
        {
            var rootFolder = file.ToLower().Substring(0, file.ToLower().IndexOf(root) + root.Length);
            rootFolder = file.Substring(0, rootFolder.Length);
            var name = "";
            var fi = new FileInfo(file);
            if (IsBreakout(fi)) {
                log($"The layout file '{fi.Name}' breaks out of the inheritence chain");
                // find breakout layout
                var breakoutLayout = Path.GetFileNameWithoutExtension(fi.FullName).Split('@')[1];
                var layoutPath = SegmentFolder(breakoutLayout, rootFolder);
                //var layoutPath = fi.FullName.Substring(0,fi.FullName.IndexOf(breakoutLayout));
                if(string.IsNullOrEmpty(layoutPath.Name))
                {
                    // sreach for layout at root
                    layoutPath = new FileInfo(file.ToLower().Substring(0, file.ToLower().IndexOf(root) + root.Length));
                    layoutPath = new FileInfo(file.Substring(0, layoutPath.FullName.Length));
                } else
                {
                    layoutPath = SegmentFolder(breakoutLayout, rootFolder);
                }
                log($"Searching for breakout layout in: {layoutPath}");
                if(HasLayout(layoutPath.DirectoryName))
                {
                    name = LayoutOf(layoutPath.DirectoryName).FullName;
                } else
                {
                    log($"Could not find breakout layout in: {layoutPath}");
                    var dir = fi.Directory;

                    if (skipSameDirectory && !IsRoot(dir.Name, root))
                    {
                        dir = dir.Parent;
                    }
                    else if (skipSameDirectory && IsRoot(dir.Name, root))
                    {
                        return "";
                    }

                    // check if the directory contains a Layout file
                    while (!HasLayout(dir.FullName))
                    {
                        dir = dir.Parent;
                    }
                    // we found a layout file
                    name = LayoutOf(dir.FullName).FullName;
                }
            } else
            {
                var dir = fi.Directory;

                if(skipSameDirectory && !IsRoot(dir.Name,root))
                {
                    dir = dir.Parent;
                } else if(skipSameDirectory && IsRoot(dir.Name,root))
                {
                    return "";
                }

                // check if the directory contains a Layout file
                while (!HasLayout(dir.FullName))
                {
                    dir = dir.Parent;
                }
                // we found a layout file
                name = LayoutOf(dir.FullName).FullName;
            }

            log($"Found layout file: {name}");
            //var className = $"{new NamespaceSegments(name,root).Value}.{new SanititizedNamespace(Path.GetFileNameWithoutExtension(name)).Value}";
            var className = new SanititizedNamespace($"{new NamespaceSegments(name, root).Value}.{Path.GetFileNameWithoutExtension(name)}").Value;
            return className;
        })
        { }

        private static bool IsRoot(string current, string root)
        {
            return current.Equals(root, StringComparison.InvariantCultureIgnoreCase);
        }

        private static bool HasLayout(string dir)
        {
            return new DirectoryInfo(dir).GetFiles("*.razor").Where(f => new IsLayout(f).Value).Count() > 0;
        }

        private static FileInfo LayoutOf(string path)
        {
            return new DirectoryInfo(path).GetFiles("*.razor").Where(f => new IsLayout(f).Value).First();
        }

        private static bool IsBreakout(FileInfo file)
        {
            return file.Name.Contains("@");
        }

        private static FileInfo SegmentFolder(string segment, string rootFolder)
        {
            return
                new DirectoryInfo(rootFolder)
                .GetFiles("*.razor", SearchOption.AllDirectories)
                .Where(f => new IsLayout(f).Value)
                .Where(f => f.FullName.Split(new char[] { Path.DirectorySeparatorChar }, StringSplitOptions.RemoveEmptyEntries).Contains(segment))
                .First();
        }

        private static string FindFileUpwards(string currentDirectory, string fileName, string root = "pages", bool skipSameDirectory = false)
        {
            string filePath = Path.Combine(currentDirectory, fileName);

            if(!skipSameDirectory)
            {
                if (File.Exists(filePath))
                {
                    return filePath;
                }
            }

            string parentDirectory = Directory.GetParent(currentDirectory)?.FullName;

            // If there is no parent directory, we have reached the root, and the file is not found.
            if (parentDirectory == null || new DirectoryInfo(parentDirectory).Name.Equals(root,StringComparison.InvariantCultureIgnoreCase))
            {
                // we are in the root dirtectory.. we cannot go up further but there might be a layout file
                filePath = Path.Combine(parentDirectory, fileName);
                if (File.Exists(filePath))
                {
                    return filePath;
                } else {
                    return "";
                }
            }

            // Recursively search in the parent directory.
            return FindFileUpwards(parentDirectory, fileName);
        }

    }
}
