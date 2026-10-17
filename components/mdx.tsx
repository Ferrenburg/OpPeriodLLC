import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { readPublicImage } from "@/lib/images";
import { ButtonLink } from "./button";

// Building blocks project pages can use in MDX without importing anything.
// Colors come from --project-accent, set by the project page.

export function Section({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="mdx-section">
      {title && <h2>{title}</h2>}
      {children}
    </section>
  );
}

type Feature = string | { title: string; text?: string };

export function FeatureGrid({ items = [], children }: { items?: Feature[]; children?: ReactNode }) {
  return (
    <div className="not-prose my-8">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const { title, text } = typeof item === "string" ? { title: item, text: undefined } : item;
          return (
            <li key={title} className="border border-line bg-bg p-5">
              <span className="slant-bar" aria-hidden="true" />
              <p className="mt-3 text-lg font-semibold leading-snug">{title}</p>
              {text && <p className="mt-1 text-muted">{text}</p>}
            </li>
          );
        })}
      </ul>
      {children}
    </div>
  );
}

export function Callout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div role="note" className="not-prose my-8 border-l-4 bg-surface p-5 [border-color:var(--project-accent,var(--accent-fill))]">
      {title && <p className="font-display text-xl font-bold uppercase italic">{title}</p>}
      <div className="mt-1 space-y-3 text-fg [&_a]:font-semibold [&_a]:underline">{children}</div>
    </div>
  );
}

export function ImageBlock({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  const image = readPublicImage(src);
  if (!image) throw new Error(`ImageBlock: no file at public${src}`);
  return (
    <figure className="not-prose my-8">
      <Image
        src={image.src}
        width={image.width}
        height={image.height}
        alt={alt}
        sizes="(min-width: 768px) 48rem, 100vw"
        className="h-auto w-full"
      />
      {caption && <figcaption className="mt-2 text-sm text-muted">{caption}</figcaption>}
    </figure>
  );
}

export function CTA({ label, href }: { label: string; href: string }) {
  return (
    <div className="not-prose my-8">
      <ButtonLink href={href} variant="accent">
        {label}
      </ButtonLink>
    </div>
  );
}

function MdxLink({ href = "", ...props }: ComponentProps<"a">) {
  if (href.startsWith("/") || href.startsWith("#")) return <Link href={href} {...props} />;
  return <a href={href} rel="noopener noreferrer" target="_blank" {...props} />;
}

export const mdxComponents = { Section, FeatureGrid, Callout, ImageBlock, CTA, a: MdxLink };
