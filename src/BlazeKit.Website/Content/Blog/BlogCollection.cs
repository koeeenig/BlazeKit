using BlazeKit.Static.ContentCollections;
using BlazeKit.Static.Utils;
using YamlDotNet.Serialization;
namespace BlazeKit.Website;
public sealed class BlogSchema : ISchema
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

public sealed class BlogCollection : ContentCollectionEnvelope
{
    public const string CollectionName = "blog";
    public BlogCollection() : base(
        CollectionName,
        Path.Combine("content","blog"),
        md => md.GetFrontMatter<BlogSchema>(),
        schema => (schema as BlogSchema).IsDraft == false // you can set a filter here to only include certain items
    )
    { }
    public override string Route(ISchema item)
    {
        return $"/blog/{(item as BlogSchema).Slug}";
    }
}

