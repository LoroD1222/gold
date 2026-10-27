import type {PortableTextBlock} from '@portabletext/types';
import {sanityFetch} from '@/lib/sanity';

export type BlogImage = {
  url?: string;
  alt?: string;
};

export type BlogPostCard = {
  _id: string;
  title: string;
  slug: string;
  publishedAt?: string;
  excerpt?: string;
  coverImage?: BlogImage;
};

export type BlogPost = BlogPostCard & {
  mainContent?: PortableTextBlock[];
};

const blogPostCardProjection = `{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  "coverImage": coverImage{"url": asset->url, alt}
}`;

const blogPostsQuery = `
  *[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) ${blogPostCardProjection}
`;

const blogPostQuery = `
  *[_type == "blogPost" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    "coverImage": coverImage{"url": asset->url, alt},
    mainContent
  }
`;

export async function getBlogPosts() {
  return sanityFetch<BlogPostCard[]>(blogPostsQuery, {}, 60);
}

export async function getBlogPost(slug: string) {
  return sanityFetch<BlogPost | null>(blogPostQuery, {slug}, 60);
}
