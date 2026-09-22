import { PortableText as SanityPortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@/lib/safariTrips";

export function PortableText({ value, className }: { value?: PortableTextBlock[]; className?: string }) {
  if (!value?.length) return null;

  return (
    <div className={className}>
      <SanityPortableText
        value={value}
        components={{
          block: {
            normal: ({ children }) => <p>{children}</p>,
          },
        }}
      />
    </div>
  );
}
