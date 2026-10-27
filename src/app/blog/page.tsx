import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {Footer} from '@/components/layout/Footer';
import {Header} from '@/components/layout/Header';
import {getBlogPosts} from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Practical Tanzania safari inspiration, family travel advice, and stories from Golden Trips Tanzania.',
  alternates: {canonical: '/blog'},
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getBlogPosts().catch(() => []);

  return (
    <>
      <Header />
      <main className="bg-sand pb-24 sm:pb-32">
        <section className="border-b border-ink/10 bg-cream py-20 sm:py-24 lg:py-28" aria-labelledby="blog-title">
          <div className="narrow-container max-w-[900px] text-center">
            <p className="eyebrow">Golden Trips Tanzania</p>
            <h1 id="blog-title" className="mt-6 text-[46px] font-semibold leading-[1.02] tracking-[-0.055em] sm:text-[62px]">Blog</h1>
            <p className="mx-auto mt-7 max-w-[650px] text-[17px] leading-[1.7] text-ink/65 sm:text-[19px]">Safari inspiration, thoughtful family travel advice, and stories from Tanzania&apos;s wild places.</p>
          </div>
        </section>

        <section className="site-container pt-14 sm:pt-20" aria-label="Latest articles">
          {posts.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article key={post._id} className="group overflow-hidden rounded-[16px] bg-cream shadow-[0_8px_30px_rgba(22,23,19,.06)]">
                  <Link href={`/blog/${post.slug}`} className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
                    <div className="relative aspect-[16/10] bg-[#e8dcc8]">
                      {post.coverImage?.url ? <Image src={post.coverImage.url} alt={post.coverImage.alt ?? post.title} fill sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1023px) calc((100vw - 4rem) / 2), 380px" className="object-cover transition duration-500 group-hover:scale-[1.03]" /> : null}
                    </div>
                    <div className="p-7 sm:p-8">
                      {post.publishedAt ? <p className="text-sm font-semibold uppercase tracking-[.11em] text-brand-dark">{formatDate(post.publishedAt)}</p> : null}
                      <h2 className="mt-4 text-[27px] font-semibold leading-[1.15] tracking-[-0.035em] group-hover:text-brand-dark">{post.title}</h2>
                      {post.excerpt ? <p className="mt-4 line-clamp-3 text-[15px] leading-[1.7] text-ink/65">{post.excerpt}</p> : null}
                      <span className="mt-6 inline-flex text-sm font-bold text-brand-dark underline decoration-1 underline-offset-4">Read article</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[16px] border border-ink/10 bg-cream px-6 py-16 text-center sm:px-10">
              <p className="text-[24px] font-semibold tracking-[-0.03em]">Stories from Tanzania are coming soon.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'}).format(new Date(`${value}T00:00:00Z`));
}
