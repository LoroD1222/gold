import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "text";
  className?: string;
};

export function ButtonLink({ href, children, variant = "primary", className = "" }: ButtonLinkProps) {
  const styles = {
    primary: "bg-brand text-ink hover:bg-brand-dark",
    outline: "border border-brand bg-white/10 text-white hover:bg-brand/20",
    text: "text-brand underline decoration-1 underline-offset-4 hover:text-brand-dark",
  };

  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center rounded-md px-6 py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
