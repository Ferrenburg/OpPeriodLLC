import Link from "next/link";

// Rounded, sentence-case buttons. The primary one carries a soft glow in the
// accent color; ghost buttons are outlined, with a light and a dark version.
const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border px-6 text-[0.95rem] font-semibold transition duration-200 hover:-translate-y-0.5";

export const buttonVariants = {
  primary:
    "border-transparent bg-gradient-to-r from-accent-fill to-accent-fill-hover text-white shadow-[0_10px_26px_-12px_var(--accent-fill)] hover:shadow-[0_16px_36px_-12px_var(--accent-fill)]",
  // A project's own color, set by the project page. Falls back to primary.
  accent:
    "border-transparent bg-[var(--project-accent,var(--accent-fill))] text-[var(--project-accent-text,#fff)] shadow-[0_10px_26px_-14px_var(--project-accent,var(--accent-fill))] hover:brightness-95",
  secondary: "border-line-2 bg-transparent text-fg hover:border-accent-fill hover:bg-card hover:text-accent",
  // For dark bands and heroes.
  onDark: "border-white/45 bg-white/5 text-white hover:border-white hover:bg-white/15",
} as const;

type Props = {
  href: string;
  variant?: keyof typeof buttonVariants;
  children: React.ReactNode;
  className?: string;
};

export const buttonClass = (variant: keyof typeof buttonVariants = "primary", className = "") =>
  `${base} ${buttonVariants[variant]} ${className}`;

export function ButtonLink({ href, variant = "primary", children, className = "" }: Props) {
  return (
    <Link href={href} className={buttonClass(variant, className)}>
      {children}
    </Link>
  );
}
