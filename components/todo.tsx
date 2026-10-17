// Marks copy the owner still needs to write or confirm. Shown in local dev
// and Vercel previews so it's easy to spot; hidden on the live site.
// Search for <Todo to find them all; each is also listed in CONTENT-TODO.md.
export const showTodos = process.env.VERCEL_ENV !== "production";

export function Todo({ children }: { children: React.ReactNode }) {
  if (!showTodos) return null;
  return (
    <span className="block border-2 border-dashed border-line px-4 py-3 text-muted">
      <span className="font-semibold text-fg">TODO: owner to provide.</span> {children}
    </span>
  );
}
