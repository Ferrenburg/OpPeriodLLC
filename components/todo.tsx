// Marks copy the owner still needs to write or confirm. Easy to spot on the
// page and easy to find in code (search for <Todo). Every one is also listed
// in CONTENT-TODO.md.
export function Todo({ children }: { children: React.ReactNode }) {
  return (
    <span className="block border-2 border-dashed border-line px-4 py-3 text-muted">
      <span className="font-semibold text-fg">TODO: owner to provide.</span> {children}
    </span>
  );
}
