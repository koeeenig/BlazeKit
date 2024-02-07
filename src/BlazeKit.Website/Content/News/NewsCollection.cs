using BlazeKit.Static.ContentCollections;
using BlazeKit.Static.Utils;
using YamlDotNet.Serialization;
namespace BlazeKit.Website;

public class NewsSchema : ISchema
{
    [YamlMember(Alias = "title")]
    public required string Title { get; set; }
    [YamlMember(Alias = "description")]
    public required string Description { get; set; }
    [YamlMember(Alias = "author")]
    public required string Author { get; set; }
    [YamlMember(Alias = "slug")]
    public required string Slug { get; set; }

    [YamlMember(Alias = "date")]
    public required DateTime Date { get; set; }

    [YamlMember(Alias = "draft")]
    public required bool IsDraft { get; set; }
    public required string Content { get;set; }
}

public class NewsCollection : ContentCollectionEnvelope
{
    public const string CollectionName = "News";
    public NewsCollection() : base(CollectionName, md => md.GetFrontMatter<NewsSchema>())
    { }

    public override string Route(ISchema item)
    {
        return $"/news/{(item as NewsSchema).Slug}";
    }
}
