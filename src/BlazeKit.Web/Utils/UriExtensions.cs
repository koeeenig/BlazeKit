namespace BlazeKit.Web.Utils
{
    public static class UriExtensions
    {
        public static string Param(this Uri uri, string name)
        {
            return Param(uri,name, () => throw new InvalidOperationException($"There is no query param with the name '{name}' in the route."));
        }

        public static string Param(this Uri uri, string name, string fallback)
        {
           return Param(uri,name, fallbackFunc: () => fallback);
        }

        private static string Param(Uri uri, string name, Func<string> fallbackFunc)
        {
            string result = string.Empty;
            var queryDictionary = System.Web.HttpUtility.ParseQueryString(uri.Query);
            if (queryDictionary.HasKeys() && queryDictionary.AllKeys.Contains(name))
            {
                result = queryDictionary[name];
            } else
            {
                result = fallbackFunc();
            }
            return result;
        }
    }
}
