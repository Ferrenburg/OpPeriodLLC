import type { ProjectStatus } from "@/lib/projects";

const labels: Partial<Record<ProjectStatus, string>> = {
  "in-development": "In development",
  "coming-soon": "Coming soon",
  retired: "Retired",
};

// Active projects get no badge. Neutral colors so it reads on any accent.
export function StatusBadge({ status }: { status: ProjectStatus }) {
  const label = labels[status];
  if (!label) return null;
  return (
    <span className="inline-flex items-center border border-line bg-surface px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-fg">
      {label}
    </span>
  );
}
