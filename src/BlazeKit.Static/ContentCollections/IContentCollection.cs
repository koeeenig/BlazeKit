namespace BlazeKit.Static.ContentCollections;

public interface IContentCollection
{
    string Name { get;}
    IEnumerable<ISchema> Items { get; }

    string Route(ISchema item);
}
