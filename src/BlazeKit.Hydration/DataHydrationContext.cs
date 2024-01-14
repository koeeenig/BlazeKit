using System.Text.Json;

namespace BlazeKit.Hydration;
public class DataHydrationContext
{
    private bool initalized = false;
    public DataHydrationContext(Func<Task<string>> loadData = null)
    {
        _hydrationData = new Dictionary<string, object>();
        this.loadData = loadData;
    }

    private Dictionary<string, object> _hydrationData;
    private readonly Func<Task<string>> loadData;

    public void Add(string key, object value)
    {
        if(_hydrationData.ContainsKey(key)) {
            _hydrationData[key] = value;
        } else {
            _hydrationData.Add(key, value);
        }
    }

    public async Task<T> GetAsync<T>(string key, T defaultValue)
    {
        var result = defaultValue;
        if(OperatingSystem.IsBrowser()) {
           await LoadData();
        }

        if(_hydrationData.TryGetValue(key, out var tmpValue)) {
            var deserialzed = JsonSerializer.Deserialize<T>(((JsonElement)tmpValue).GetRawText());
            result = deserialzed;
        }
        return result;
    }

    public bool TryGet<T>(string key, out T value)
    {
        if(OperatingSystem.IsBrowser() && !initalized) {
           LoadData();
        }
        value = default;
        if(_hydrationData.TryGetValue(key, out var tmpValue)) {
            // check if tmpValue is of type T
            if(tmpValue is T) {
                value = (T)tmpValue;
                return true;
            } else {
                value = default;
                return false;
            }
        } else {
            return false;
        }
    }

    public string Serialized() {
        return System.Text.Json.JsonSerializer.Serialize(_hydrationData);
    }

    private async Task<bool> LoadData() {
         // check if initalized if not hydrate data from dom
        Console.WriteLine("Loading page data");
        var data = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string,object>>(await loadData());
            foreach(var item in data) {
                if(_hydrationData.ContainsKey(item.Key)) {
                    _hydrationData[item.Key] = item.Value;
                } else {
                    _hydrationData.Add(item.Key, item.Value);
                }
            }
        // if(!initalized) {
        //     var data = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string,object>>(await loadData());
        //     foreach(var item in data) {
        //         _hydrationData.Add(item.Key, item.Value);
        //     }
        //     initalized = true;
        // }

        return true;
    }
}