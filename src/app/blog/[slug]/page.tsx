import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {BlogRichText} from '@/components/blog/BlogRichText';
import {Footer} from '@/components/layout/Footer';
import {Header} from '@/components/layout/Header';
import {getBlogPost} from '@/lib/blog';

type BlogPostPageProps = {params: Promise<{slug: string}>};

export const revalidate = 60;

export async function generateMetadata({params}: BlogPostPageProps): Promise<Metadata> {
  const {slug} = await params;
  const post = await getBlogPost(slug).catch(() => null);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {canonical: `/blog/${post.slug}`},
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      images: post.coverImage?.url ? [{url: post.coverImage.url, alt: post.coverImage.alt ?? post.title}] : undefined,
    },
  };
}

export default async function BlogPostPage({params}: BlogPostPageProps) {
  const {slug} = await params;
  const post = await getBlogPost(slug).catch(() => null);
  if (!post) notFound();

  return (
    <>
      <Header />
      <main className="bg-cream pb-24 sm:pb-32">
        <article>
          <header className="bg-sand py-16 sm:py-20 lg:py-24">
            <div className="narrow-container max-w-[900px]">
              <Link href="/blog" className="text-sm font-semibold text-brand-dark underline decoration-1 underline-offset-4 hover:text-brand">← Back to blog</Link>
              {post.publishedAt ? <p className="mt-10 text-sm font-semibold uppercase tracking-[.11em] text-brand-dark">{formatDate(post.publishedAt)}</p> : null}
              <h1 className="mt-5 text-[42px] font-semibold leading-[1.05] tracking-[-0.05em] sm:text-[58px]">{post.title}</h1>
              {post.excerpt ? <p className="mt-7 max-w-[740px] text-[18px] leading-[1.7] text-ink/65 sm:text-[20px]">{post.excerpt}</p> : null}
            </div>
          </header>

          {post.coverImage?.url ? <div className="site-container relative -mt-1 max-w-[1160px]"><div className="relative aspect-[16/8] overflow-hidden rounded-b-[18px]"><Image src={post.coverImage.url} alt={post.coverImage.alt ?? post.title} fill priority sizes="(max-width: 1200px) 100vw, 1160px" className="object-cover" /></div></div> : null}

          <div className="narrow-container max-w-[780px] py-16 sm:py-20">
            <BlogRichText value={post.mainContent} />
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'}).format(new Date(`${value}T00:00:00Z`));
}
