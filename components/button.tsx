import Link from "next/link";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-sm px-6 font-display text-lg font-semibold uppercase italic tracking-wide transition-colors";

const variants = {
  primary: "bg-accent-fill text-white hover:bg-accent-fill-hover",
  // A project's own color, set by the project page. Falls back to primary.
  accent:
    "bg-[var(--project-accent,var(--accent-fill))] text-[var(--project-accent-text,#fff)] hover:brightness-90",
  secondary: "border-2 border-fg text-fg hover:bg-fg hover:text-bg",
  // For dark bands, where the theme's foreground color would be wrong.
  onDark: "border-2 border-band-fg text-band-fg hover:bg-band-fg hover:text-band",
} as const;

type Props = {
  href: string;
  variant?: keyof typeof variants;
  children: React.ReactNode;
  className?: string;
};

export function ButtonLink({ href, variant = "primary", children, className = "" }: Props) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
