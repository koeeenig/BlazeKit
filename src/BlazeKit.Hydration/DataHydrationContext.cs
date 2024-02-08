using System.Text.Json;
using System.Text.Json.Serialization;

namespace BlazeKit.Hydration;
public class DataHydrationContext
{
    private bool initalized = false;
    private Action? onUpdate = null;
    private Dictionary<string, object> hydrationData;
    private readonly Func<Task<string>>? loadData;


    public DataHydrationContext(Func<Task<string>>? loadData = null)
    {
        hydrationData = new Dictionary<string, object>();
        this.loadData = loadData;
    }


    public void Add(string key, object value)
    {
        if(hydrationData.ContainsKey(key)) {
            hydrationData[key] = value;
        } else {
            hydrationData.Add(key, value);
        }

        if(this.onUpdate != null)
        {
            this.onUpdate();
        }
    }

    public async Task<T> GetAsync<T>(string key, T defaultValue)
    {
        var result = defaultValue;
        if(OperatingSystem.IsBrowser()) {
           await LoadData();
        }

        if(OperatingSystem.IsBrowser())
        {
            if (hydrationData.TryGetValue(key, out var tmpValue))
            {
                var deserialzed = JsonSerializer.Deserialize<T>(((JsonElement)tmpValue).GetRawText(),new JsonSerializerOptions() { IncludeFields = true});
                result = deserialzed;
            }
        } else
        {
            if(hydrationData.TryGetValue(key, out var tmpValue)) {
                //var deserialzed = JsonSerializer.Deserialize<T>(((JsonElement)tmpValue).GetRawText(),new JsonSerializerOptions() { IncludeFields = true});
                result = (T)tmpValue;
            }
        }
        return result;
    }

    public bool TryGet<T>(string key, out T value)
    {
        if(OperatingSystem.IsBrowser() && !initalized) {
           LoadData();
        }
        value = default;
        if(hydrationData.TryGetValue(key, out var tmpValue)) {
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

    internal string AsJson() {
        return System.Text.Json.JsonSerializer.Serialize(hydrationData);
    }

    internal string AsBase64()
    {
        return 
            Convert.ToBase64String(
                JsonSerializer.SerializeToUtf8Bytes(
                    System.Text.Json.JsonSerializer.Serialize(hydrationData),
                    new JsonSerializerOptions
                    {
                        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                        PropertyNameCaseInsensitive = true,
                        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
                    })
            );
    }


    internal void OnUpdate(Action onUpdate)
    {
        this.onUpdate = onUpdate;
    }

    internal bool IsEmpty()
    {
        return this.hydrationData.Keys.Count == 0;
    }

    private async Task<bool> LoadData() {
         // check if initalized if not hydrate data from dom
        var data = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string,object>>(await loadData());
            foreach(var item in data) {
                if(hydrationData.ContainsKey(item.Key)) {
                    hydrationData[item.Key] = item.Value;
                } else {
                    hydrationData.Add(item.Key, item.Value);
                }
            }
        return true;
    }
}
