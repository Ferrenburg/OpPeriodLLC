import { EbPageHero } from "@/components/engine-bay/page-hero";
import { Todo } from "@/components/todo";

// Shared frame for the shop's Shipping, Returns, and Terms pages. The text is
// a draft for the owner's attorney; [brackets] mark what's still to decide.
// Remove the draft note once the attorney signs off (see CONTENT-TODO.md).
export function PolicyPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <EbPageHero title={title} />
      <div className="container-site max-w-3xl pb-16">
        <Todo>
          Draft for attorney review. Fill in or remove everything in [brackets], and have the attorney approve this page before
          the shop goes live.
        </Todo>
        <div className="mdx-body mt-8">{children}</div>
        <p className="mt-10 text-sm text-muted">Last updated: {updated}</p>
      </div>
    </>
  );
}
