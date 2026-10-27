import {PortableText, type PortableTextComponents} from '@portabletext/react';
import type {PortableTextBlock} from '@portabletext/types';

const components: PortableTextComponents = {
  block: {
    normal: ({children}) => <p className="text-[17px] leading-[1.8] text-ink/70 sm:text-[18px]">{children}</p>,
    h2: ({children}) => <h2 className="pt-5 text-[31px] font-semibold leading-[1.18] tracking-[-0.04em] sm:text-[38px]">{children}</h2>,
    h3: ({children}) => <h3 className="pt-3 text-[23px] font-semibold leading-[1.25] tracking-[-0.03em] sm:text-[27px]">{children}</h3>,
    blockquote: ({children}) => <blockquote className="border-l-4 border-brand pl-6 text-[21px] font-medium italic leading-[1.6] text-ink/75 sm:text-[24px]">{children}</blockquote>,
  },
  list: {
    bullet: ({children}) => <ul className="list-disc space-y-3 pl-6 text-[17px] leading-[1.8] text-ink/70 sm:text-[18px]">{children}</ul>,
    number: ({children}) => <ol className="list-decimal space-y-3 pl-6 text-[17px] leading-[1.8] text-ink/70 sm:text-[18px]">{children}</ol>,
  },
  marks: {
    link: ({children, value}) => {
      const href = typeof value?.href === 'string' ? value.href : '#';
      const openInNewTab = value?.openInNewTab === true;

      return <a href={href} target={openInNewTab ? '_blank' : undefined} rel={openInNewTab ? 'noreferrer' : undefined} className="font-semibold text-brand-dark underline decoration-1 underline-offset-4 hover:text-brand">{children}</a>;
    },
  },
};

export function BlogRichText({value}: {value?: PortableTextBlock[]}) {
  if (!value?.length) return null;

  return <div className="space-y-6"><PortableText value={value} components={components} /></div>;
}
