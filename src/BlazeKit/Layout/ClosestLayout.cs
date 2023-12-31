using BlazeKit.Utils;

namespace BlazeKit.Layout
{
    public sealed class ClosestLayout : Lazy<string>
    {
        public ClosestLayout(string file, Action<string> log, bool skipSameDirectory = false, string root = "pages") : base(() =>
        {
            try {
                var rootFolder = file.ToLower().Substring(0, file.ToLower().IndexOf(root) + root.Length);
                rootFolder = file.Substring(0, rootFolder.Length);

                var name = "";
                var fi = new FileInfo(file);
                if (IsBreakout(fi)) {
                    log($"The Page/Layout '{fi.Name}' breaks out of the inheritence chain");
                    // find breakout layout
                    var breakoutLayout = Path.GetFileNameWithoutExtension(fi.FullName).Split('@')[1];

                    // sreach for layout at root
                    var layoutPath = new FileInfo(file.ToLower().Substring(0, file.ToLower().IndexOf(root) + root.Length));
                    layoutPath = new FileInfo(file.Substring(0, layoutPath.FullName.Length));

                    if(!string.IsNullOrEmpty(breakoutLayout))
                    {
                        layoutPath = SegmentFolder(breakoutLayout, rootFolder);
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
                    } else {
                        name = LayoutOf(rootFolder).FullName;
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
            } catch(Exception ex)
            {
                log(ex.ToString());
                throw new InvalidOperationException($"Could not find layout for {file}");
            }

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
#pragma warning disable RS1035 // Do not use APIs banned for analyzers
                if (File.Exists(filePath))
                {
                    return filePath;
                }
#pragma warning restore RS1035 // Do not use APIs banned for analyzers
            }

#pragma warning disable RS1035 // Do not use APIs banned for analyzers
            string parentDirectory = Directory.GetParent(currentDirectory)?.FullName;
#pragma warning restore RS1035 // Do not use APIs banned for analyzers

            // If there is no parent directory, we have reached the root, and the file is not found.
            if (parentDirectory == null || new DirectoryInfo(parentDirectory).Name.Equals(root,StringComparison.InvariantCultureIgnoreCase))
            {
                // we are in the root dirtectory.. we cannot go up further but there might be a layout file
                filePath = Path.Combine(parentDirectory, fileName);
#pragma warning disable RS1035 // Do not use APIs banned for analyzers
                if (File.Exists(filePath))
                {
                    return filePath;
                } else {
                    return "";
                }
#pragma warning restore RS1035 // Do not use APIs banned for analyzers
            }

            // Recursively search in the parent directory.
            return FindFileUpwards(parentDirectory, fileName);
        }

    }
}
