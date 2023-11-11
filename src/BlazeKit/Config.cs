using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;

namespace BlazeKit
{
    /// <summary>
    /// A dictionary of key value pairs read from a blazekit config file.
    /// </summary>
    internal class Config : ReadOnlyDictionary<string,string>
    {
        /// <summary>
        /// A dictionary of key value pairs read from a blazekit config file.
        /// </summary>
        public Config(string configFile) :this(
          new FileInfo(configFile)
        )
        { }
        /// <summary>
        /// A dictionary of key value pairs read from a blazekit config file.
        /// </summary>
        public Config(FileInfo configFile) : this(() =>
        {
            var result = new Dictionary<string, string>();
            if(configFile.Exists)
            {
                // read blazekit config
                var content = File.ReadAllText(configFile.FullName);
                // extract a key value pair from each line in the format key:value with a regular expression
                result =
                    content
                        .Split(new string[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries)
                        .Select(line => line.Split(':'))
                        .ToDictionary(line => line[0], line => line[1]);
            }

            return result;
        })
        { }
        /// <summary>
        /// A dictionary of key value pairs read from a blazekit config file.
        /// </summary>
        public Config(Func<IDictionary<string,string>> config) : base(config())
        {
            
        }

        public string Value(string key, string fallback)
        {
            var result = fallback;
            if (this.ContainsKey(key))
            {
                result = this[key];
            }
            return result.Trim('\r', '\n');
        }
    }
}
