import type { Project } from "@/lib/projects";
import { Logo } from "./logo";

// The project's logo, or a square badge with its first letter in the
// project's color when there's no logo yet. The badge is decorative; the
// name is always shown as text next to it.
export function ProjectMark({ project, className, sizes }: { project: Project; className: string; sizes: string }) {
  if (project.logo) {
    return <Logo logo={{ src: project.logo, alt: `${project.name} logo` }} className={className} sizes={sizes} />;
  }
  return (
    <span
      aria-hidden="true"
      className={`inline-flex aspect-square items-center justify-center font-display font-bold italic leading-none [clip-path:polygon(0_0,78%_0,100%_22%,100%_100%,0_100%)] ${className}`}
      style={{ background: project.accent, color: project.accentText }}
    >
      {project.name.charAt(0).toUpperCase()}
    </span>
  );
}
