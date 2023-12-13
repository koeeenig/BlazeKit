namespace BlazorMinimalApi.Components
{
    public class MatchResult
    {
        public bool IsMatch { get; set; }
        public Route MatchedRoute { get; set; }

        public MatchResult(bool isMatch, Route matchedRoute)
        {
            IsMatch = isMatch;
            MatchedRoute = matchedRoute;
        }

        public static MatchResult Match(Route matchedRoute)
        {
            return new MatchResult(true, matchedRoute);
        }

        public static MatchResult NoMatch()
        {
            return new MatchResult(false, null);
        }
    }
}