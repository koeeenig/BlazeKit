using System.Threading.Tasks;

namespace BlazeKit.Abstraction;

public interface IServerLoad<TResult>
{
    Task<TResult> LoadAsync();

    TResult Load();
}
