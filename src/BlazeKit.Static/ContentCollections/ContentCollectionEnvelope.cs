using System.Linq.Expressions;
using BlazeKit.Static.Utils;
namespace BlazeKit.Static.ContentCollections;

/// <summary>
/// A collection of content items
/// </summary>
public abstract class ContentCollectionEnvelope : IContentCollection
{
    private readonly string name;
    private readonly Lazy<List<ISchema>> list;

    /// <summary>
    /// A collection of content items
    /// </summary>
    public ContentCollectionEnvelope(string collectionName, Func<string, ISchema> cast) : this(
        collectionName,
        Path.Combine("Content", collectionName),
        cast,
        schema => true
    )
    { }

    /// <summary>
    /// A collection of content items
    /// </summary>
    public ContentCollectionEnvelope(string collectionName, Func<string, ISchema> cast, Func<ISchema, bool> filter) : this(
        collectionName,
        Path.Combine("Content", collectionName),
        cast,
        filter
    )
    { }

    /// <summary>
    /// A collection of content items
    /// </summary>
    public ContentCollectionEnvelope(string collectionName, string contentDirectory, Func<string, ISchema> cast, Func<ISchema,bool> filter)
    {
        this.name = collectionName;
        this.list = new Lazy<List<ISchema>>(() => {

            // read all files from the content directory
            // and parse them into BlogSchema objects
            // use Markdig and Frontmatter extension
            var markdownFiles = Directory.GetFiles(contentDirectory, "*.md");
            var items = markdownFiles
                .Select(File.ReadAllText)
                .Select(md => {
                    var schema = cast(md);
                    schema.Content = md.Html();
                    return schema;
                })
                .Where(filter)
                .ToList();
            return items.Cast<ISchema>().ToList();
        });
    }
    public string Name => name;

    public IEnumerable<ISchema> Items => this.list.Value;

    public abstract string Route(ISchema item);
}
