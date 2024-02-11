using BlazeKit.Static.ContentCollections;
using BlazeKit.Static.Utils;
using Markdig;
using System.Text.RegularExpressions;
using YamlDotNet.Serialization;
namespace BlazeKit.Website;
public sealed class DocsCollection : ContentCollectionEnvelope
{
    public const string CollectionName = "Docs";
    public DocsCollection() : base(
        CollectionName,
        Path.Combine("Content", CollectionName),
        md => {
            var schema = md.GetFrontMatter<DocsSchema>();

            // parse each heading from markdown content and return each found heading as tuple with heading content and heading level
            var html = md.Html();
            // regex to parse html headings with id attribute. the heading should be a group and the id and the level of the heading should be a group
            var headers = Regex.Matches(html, "<h([1-6]) id=\"([^\"]*)\">([^<]*)</h[1-6]>");
            schema.Headings = new List<DocsSchema.Heading>();
            foreach (Match match in headers)
            {
                schema.Headings.Add(new DocsSchema.Heading(int.Parse(match.Groups[1].Value), match.Groups[3].Value, match.Groups[2].Value));
            }

            return schema;
        },
        schema => (schema as DocsSchema).IsDraft == false // you can set a filter here to only include certain items
    )
    { }
    public override string Route(ISchema item)
    {
        return $"/docs/{(item as DocsSchema).Slug}";
    }
}

