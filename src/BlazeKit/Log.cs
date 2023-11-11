using System;
using System.IO;

namespace BlazeKit
{
    /// <summary>
    /// A logger for BlazerKit
    /// </summary>
    internal sealed class Log
    {
        private readonly Lazy<FileInfo> logfile;
        private readonly bool enabled;

        /// <summary>
        /// A logger for BlazerKit
        /// </summary>
        public Log(string projectDir, bool enabled) : this(() => 
            new FileInfo(Path.Combine(projectDir,".blazekit", "blazerkit.log")),
            enabled
        )
        { }

        /// <summary>
        /// A logger for BlazerKit
        /// </summary>
        public Log(FileInfo logfile, bool enabled) :this(() => logfile, enabled)
        { }

        /// <summary>
        /// A logger for BlazerKit
        /// </summary>
        public Log(Func<FileInfo> logfile, bool enabled)
        {
            this.logfile = new Lazy<FileInfo>(() =>
            {
                var lf = logfile();
                if (!lf.Directory.Exists)
                {
                    lf.Directory.Create();
                }

                if(lf.Exists)
                {
                    lf.Delete();
                }

                return lf;
            });
            this.enabled = enabled;
        }

        public void Info(string message)
        {
            WriteLine($"ℹ️ {message}");
        }

        public void Debug(string message)
        {
            WriteLine($"🕵️ {message}");
        }

        public void Error(string message)
        {
            WriteLine($"💣 {message}");
        }

        private void WriteLine(string message)
        {
            if(enabled)
            {
                lock(this.logfile.Value)
                {
                    File.AppendAllText(this.logfile.Value.FullName, $"🕑 {DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")} {message}{Environment.NewLine}");
                }
            }
        }
    }
}
