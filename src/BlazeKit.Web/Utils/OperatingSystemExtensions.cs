namespace BlazeKit.Web.Utils
{
    public static class OperatingSystemExtensions
    {
        public static bool IsServer(this OperatingSystem operatingSystem)
        {
            return OperatingSystem.IsBrowser() == false;
        }
    }
}
