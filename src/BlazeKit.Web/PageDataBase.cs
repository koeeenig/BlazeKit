using System.Text.Json.Serialization;

namespace BlazeKit.Web;

public class PageDataBase
{
    public PageDataBase()
    {
        
    }
    [JsonIgnore]
    public string Key => "pagedata";

    public static PageDataBase Empty()
    {
        return new PageDataBase();
    }
    
}
