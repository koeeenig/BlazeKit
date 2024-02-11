using BlazeKit.Static.ContentCollections;
using YamlDotNet.Serialization;

namespace BlazeKit.Website;
public sealed class DocsSchema : ISchema
{
    [YamlMember(Alias = "title")]
    public required string Title { get; set; }
    [YamlMember(Alias = "category")]
    public required string Category { get; set; } = "";
    [YamlMember(Alias = "slug")]
    public required string Slug { get; set; }
    [YamlMember(Alias = "draft")]
    public required bool IsDraft { get; set; }
    public required string Content { get;set; }

    public IList<Heading> Headings { get; set; } = new List<Heading>();

    public record Heading(int Level, string Title, string Id);
}
