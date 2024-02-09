using Markdig;
using Markdig.Extensions.Yaml;
using Markdig.Syntax;
using YamlDotNet.Serialization;

namespace BlazeKit.Static.Utils;

public static class MarkdownExtensions
{
    private static readonly IDeserializer YamlDeserializer =
        new DeserializerBuilder()
        .IgnoreUnmatchedProperties()
        .Build();

    private static readonly MarkdownPipeline Pipeline
        = new MarkdownPipelineBuilder()
        .UseAdvancedExtensions()
        .UseYamlFrontMatter()
        .Build();

    public static T? GetFrontMatter<T>(this string markdown)
    {
        var document = Markdown.Parse(markdown, Pipeline);
        var block = document
            .Descendants<YamlFrontMatterBlock>()
            .FirstOrDefault();

        if (block == null)
            return default;

        var yaml =
            block
            // this is not a mistake
            // we have to call .Lines 2x
            .Lines // StringLineGroup[]
            .Lines // StringLine[]
            .OrderByDescending(x => x.Line)
            .Select(x => $"{x}\n")
            .ToList()
            .Select(x => x.Replace("---", string.Empty))
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .Aggregate((s, agg) => agg + s);

        // Console.WriteLine(yaml);
        // var deserializer = new DeserializerBuilder().Build();
        // var result = deserializer.Deserialize<Dictionary<string, object>>(yaml);
        // Console.WriteLine(result["title"]);
        // Console.WriteLine(result["author"]);
        return YamlDeserializer.Deserialize<T>(yaml);
    }

    public static string Html(this string markdown)
    {
        return Markdown.ToHtml(markdown,Pipeline);
    }
}
