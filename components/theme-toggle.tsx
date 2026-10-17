"use client";

function currentTheme(): "light" | "dark" {
  const set = document.documentElement.getAttribute("data-theme");
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Both icons render on the server and CSS shows the right one, so the
// button never needs to know the theme until it is clicked.
export function ThemeToggle({ className = "" }: { className?: string }) {
  function toggle() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private browsing can block storage. The switch still works for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex size-11 items-center justify-center rounded-sm text-muted hover:bg-surface hover:text-fg ${className}`}
    >
      <span className="sr-only">Switch between light and dark theme</span>
      {/* Moon, shown in light mode */}
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 dark:hidden" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
      {/* Sun, shown in dark mode */}
      <svg aria-hidden="true" viewBox="0 0 24 24" className="hidden size-5 dark:block" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
