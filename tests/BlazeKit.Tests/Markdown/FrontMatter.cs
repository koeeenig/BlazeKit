using Markdig;
using Markdig.Extensions.Yaml;
using Markdig.Parsers;
using Markdig.Syntax;

namespace BlazeKit.Tests;

public class FrontMatter
{
    [Theory]
    [InlineData(@"---
title: Hello World
tags: [hello, world]
---
# Topic")]
    public void ParsesFrontmatter(string mardown)
    {
        var pipeline = new Markdig.MarkdownPipelineBuilder().UseAdvancedExtensions().UseYamlFrontMatter();
        var document = Markdig.Markdown.Parse(mardown, pipeline.Build());
        // extract the front matter from markdown document
        var yamlBlock = document.Descendants<YamlFrontMatterBlock>().FirstOrDefault();

        var yaml = yamlBlock!.Lines.ToString();
        Assert.NotEmpty(document.Descendants<YamlFrontMatterBlock>());
    }
}
