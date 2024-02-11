---
title: Content Collections
category: Core Concepts
draft: false
slug: content-collections
---
# Content Collections
In BlazeKit, Content Collections are a core concept that allows you to manage and organize your content in a structured way. Similar to the [Astro](https://astro.build/) framework, a Content Collection in BlazeKit is any top-level directory inside the reserved `/Content` project directory. For example, `/Content/Blog` and `/Content/Authors` could be considered as Content Collections.
# What are Content Collections

Content Collections provide a way to group related content together. This could be blog posts, author profiles, product descriptions, or any other type of content your project requires. Each item within a Content Collection is a file, and the data within these files can be queried and used throughout your application.

This feature allows for a more organized project structure and makes it easier to manage content, especially in large projects. It also enables dynamic routing based on the content files, which can greatly simplify the creation of pages for individual content items.

In the following sections, we will discuss how to define, query, and generate routes from Content Collections in BlazeKit.
# Defining Collections
To define a Content Collection, create a new top-level directory inside the `/Content` directory in your project. Usually, the name of the directory represents the name of the Content Collection. For example, to create a Content Collection for blog posts, you would create a `/Content/Blog` directory.

Inside this directory, each file represents an item in the collection. The file is a Markdown (.md) file. The frontmatter of the file can contain metadata about the content item.
Here's an example of a Content Collection class for a collection of documents:
```md
---
title: My First Blog Post
date: 2022-01-01
author: John Doe
---

This is my first blog post.
```
## Frontmatter
Each Content Collection can have an associated [Frontmatter](https://frontmatter.codes/) Schema. This schema defines the structure of the metadata in the frontmatter of the content files in the collection. The schema is represented by a class that implements the `ISchema` interface from the `BlazeKit.Static.ContentCollections` namespace.
Here's an example of a schema class for a blog post:
```csharp
using BlazeKit.Static.ContentCollections;
using YamlDotNet.Serialization;

public class BlogPostSchema : ISchema
{
    [YamlMember(Alias = "title")]
    public string Title { get; set; }
    [YamlMember(Alias = "author")]
    public string Author { get; set; }
    [YamlMember(Alias = "date")]
    public DateTime Date { get; set; }
    [YamlMember(Alias = "draft")]
    public bool IsDraft { get; set; }
    // The content of the markdown file
    public bool Content { get; set; }
}
```
In this example, the `BlogPostSchema` class defines the structure of the metadata in the frontmatter of the blog post files. Each property in the class corresponds to a field in the frontmatter. When you query the Blog collection, you can access the metadata of the blog posts through the properties of the `BlogPostSchema` class. For example, `post.Title` would give you the title of the blog post.

Remember to replace the property names and types to match the fields in your frontmatter. The property names should be the same as the field names in the frontmatter, and the property types should be compatible with the field values.

## IContentCollection
The `IContentCollection` interface in BlazeKit is a crucial part of the Content Collection system. It serves as a contract for all Content Collections, ensuring they provide certain functionalities that BlazeKit relies on to handle and serve content.

Implementing the IContentCollection interface makes a Content Collection available to BlazeKit. This means BlazeKit can access, query, and generate routes for the content items in the collection.

Here's the basic structure of the IContentCollection interface:
```csharp
public interface IContentCollection
{
    string Name { get; }
    IEnumerable<ISchema> Items { get; }
    string Route(ISchema item);
}
```
The IContentCollection interface includes:
- Name: A string property that represents the name of the Content Collection.
- Items: An enumerable of `ISchema` objects that represents the content items in the collection.
- `Route(ISchema item)`: A method that takes an ISchema object and returns a string. This method defines the route for each item in the collection.
- When you create a Content Collection class, you need to implement the `IContentCollection` interface and provide implementations for the Name, Items, and `Route(ISchema item)` members.

For example, here's how you might implement the IContentCollection interface for a Blog Content Collection:
```csharp
public sealed class BlogCollection : IContentCollection
{
    public string Name => "Blog";
    public IEnumerable<ISchema> Items { get; private set; }

    public DocsCollection(IEnumerable<ISchema> items)
    {
        Items = items;
    }

    public string Route(ISchema item)
    {
        return $"/Blog/{(item as BlogPostSchema).Slug}";
    }
}
```
## ContentCollectionEnvelope
The `ContentCollectionEnvelope` class is an abstract class that simplifies the process of implementing the `IContentCollection` interface. It provides a basic structure and common functionalities for a Content Collection, which you can then extend and customize to suit your needs.

Here's a brief overview of how to use ContentCollectionEnvelope:
```csharp
public sealed class BlogCollection : ContentCollectionEnvelope
{
    public const string CollectionName = "Blog";
    public DocsCollection() : base(
        CollectionName,
        Path.Combine("Content", CollectionName),
        md => {
             var schema = md.GetFrontMatter<BlogPostSchema>();
            // Do additional stuff with the markdown content such a extracting headers for e.g. sitemaps
            // ...
            return schema;
        },
        schema => (schema as BlogPostSchema).IsDraft == false // Filter out draft items
    )
    { }

    public override string Route(ISchema item)
    {
        // Define the route for each item in the collection
        return $"/Blog/{(item as BlogPostSchema).Slug}";
    }
}
```
In this example, the `BlogCollection` class inherits from `ContentCollectionEnvelope` and provides implementations for the required methods.
The ContentCollectionEnvelope constructor takes three arguments:

1. The name of the collection.
2. The path to the directory that contains the content files.
3. A function that parses the frontmatter and the content of the markdown files.
4. A function that filters the items in the collection.

The `Route` method, which is abstract in `ContentCollectionEnvelope` and must be overridden, defines the route for each item in the collection.

By using `ContentCollectionEnvelope`, you can create a Content Collection with less boilerplate code and a clear, consistent structure. This makes it easier to manage and extend your Content Collections as your project grows.

## StaticServiceCollection
The `StaticServiceCollection` is a specialized service collection designed for static site generation. It's an implementation of the `IStaticServiceCollection` interface and is used to register and manage services that are required during the static site generation process.

**Purpose**

The main purpose of `StaticServiceCollection` is to provide a centralized location for registering and accessing services that are used in static site generation. This includes all Content Collections, which need to be added as KeyedSingleton services. A KeyedSingleton service is a service that is registered with a key and behaves like a singleton service

In the context of `StaticServiceCollection`, each Content Collection is registered as a KeyedSingleton service. The key for each service is the name of the Content Collection, which allows the service to be retrieved based on the collection name.

```csharp
/// <summary>
/// A static service collection that is used to build a static site
/// </summary>
public sealed class StaticServiceCollection : IStaticServiceCollection
{
    private readonly Func<IServiceCollection> services;

    /// <summary>
    /// A static service collection that is used to build a static site
    /// </summary>
    public StaticServiceCollection() :this(
        new ServiceCollection()
    )
    { }

    /// <summary>
    /// A static service collection that is used to build a static site
    /// </summary>
    public StaticServiceCollection(IServiceCollection serviceCollection)
    {
        this.services = () => {
            serviceCollection.AddKeyedSingleton(BlogCollection.CollectionName, new BlogCollection());
            // ...
            return serviceCollection;
        };
    }
    public IServiceCollection Services() => services();
}
```

By using `StaticServiceCollection`, you can manage all the services required for static site generation in a consistent and organized way. This makes it easier to add, remove, and access services as your project grows.

# Query and Render Content from Collections
In BlazeKit, you can access and render content from a specific item in a Content Collection by querying the collection and filtering the items based on your criteria.
1. Access the Content Collection
You can access the `BlogCollection` in your `Page.razor` by injecting it:
```csharp
[Inject(Key = DocsCollection.CollectionName)]
public DocsCollection Collection {get;set;}
```
1. Query the Content Collection
To access a specific item in the `BlogCollection`, you can query the collection and filter the items based on e.g. the Slug:
```csharp
this.docItem =
   collection.Items.Cast<BlogPostSchema>().FirstOrDefault(
       item => item.Slug.Equals(Slug, StringComparison.InvariantCultureIgnoreCase)
   );
```
In this code, `FirstOrDefault` is a LINQ method that returns the first item that matches the provided condition, or null if no items match the condition.
1. Render the Content
Finally, you can render the content of the item in your Razor file:
```razor
@((MarkupString)docItem.Content)
```

The full `Page.razor` might look like this:
```razor
@using BlazeKit.Web.Components
@using BlazeKit.Web
@inherits PageComponentBase<PageDataBase>
@code {

    [Inject(Key = BlogCollection.CollectionName)]
    public BlogCollection Collection {get;set;}

    private BlogPostSchema? blogPostItem;

    protected override Task<PageDataBase> ServerLoadAsync(Uri route, Response response)
    {
        this.blogPostItem =
           Collection.Items.Cast<BlogPostSchema>().FirstOrDefault(
               item => item.Slug.Equals(Slug, StringComparison.InvariantCultureIgnoreCase)
           );

        // We handle a page not found here.
        // This is unlikly to happen since SSG will only have valid slug's.
        if (this.blogPostItem is null)
        {
            throw new ApplicationException($"The Slug '{Slug}' does not exist in {Collection.CollectionName}");
        }

        return Task.FromResult(default(PageDataBase));
    }
}
<PageTitle>@blogPostItem.Title - MyBlog</PageTitle>
<p>@blogPostItem.Author published on @blogPostItem.Date.ToOrdinalWords()</p>
@((MarkupString)blogPostItem.Content)
```
