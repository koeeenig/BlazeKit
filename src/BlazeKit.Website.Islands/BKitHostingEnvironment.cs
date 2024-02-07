using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;

namespace BlazeKit.Web;

public class BKitHostEnvironment : IHostEnvironment
{
    public BKitHostEnvironment(string environmentName)
    {
        EnvironmentName = environmentName;
    }
    public string ApplicationName { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
    public IFileProvider ContentRootFileProvider { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
    public string ContentRootPath { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
    public string EnvironmentName { get;set;}
}
