import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
  id?: string;
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, align = "left", id, className = "" }: SectionHeadingProps) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} ${className}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 id={id} className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.035em] text-ink lg:text-[46px]">
        {title}
      </h2>
      {description ? <div className="mt-5 text-base leading-7 text-muted">{description}</div> : null}
    </div>
  );
}
