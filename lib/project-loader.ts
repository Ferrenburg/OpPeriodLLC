// Reads and validates content/projects/*.mdx. Plain Node on purpose (no
// "server-only", no path aliases) so next.config.ts can use it for the
// short link redirects. Pages should import from lib/projects.ts instead.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { colors } from "./brand";
import { readableOn } from "./color";

const root = process.cwd();
export const projectsDir = path.join(root, "content", "projects");

export const statuses = ["active", "in-development", "coming-soon", "retired"] as const;
export type ProjectStatus = (typeof statuses)[number];

// An empty YAML field (`externalUrl:`) comes through as null. Treat it as left out.
function optional<T extends z.ZodType>(schema: T) {
  return z.preprocess((value) => (value === null || value === "" ? undefined : value), schema.optional());
}

const text = z.string().trim().min(1, "can't be empty");

// Strict, so a misspelled field name fails the build instead of being ignored.
export const frontmatterSchema = z.strictObject({
  name: text,
  slug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "use lowercase letters, numbers, and single dashes, like box-alarm-builders"),
  tagline: text.max(70, "keep it to 70 characters or fewer"),
  summary: text,
  category: text,
  status: z.enum(statuses, `must be one of: ${statuses.join(", ")}`),
  order: z.number("must be a whole number").int("must be a whole number"),
  published: z.boolean("must be true or false"),
  logo: optional(z.string().startsWith("/", "must be a path starting with /brand/ or another folder in public/")),
  accentColor: optional(z.string().regex(/^#[0-9a-fA-F]{6}$/, 'must be a hex color in quotes, like "#C60014"')),
  externalUrl: optional(z.url({ protocol: /^https?$/, error: "must be a full web address starting with https://" })),
  contactEmailKey: optional(z.string().regex(/^[A-Z0-9_]+$/, "use capital letters, numbers, and underscores, like BOX_ALARM")),
  serviceArea: optional(text),
  highlights: optional(z.array(text).min(3, "list at least 3, or remove the field").max(6, "list 6 at most")),
  cta: optional(z.strictObject({ label: text, href: text })),
});

export type Project = z.infer<typeof frontmatterSchema> & {
  href: string;
  // accentColor, or OpPeriod red when none is set.
  accent: string;
  // White or ink, whichever is readable on the accent color.
  accentText: string;
  // MDX body, compiled when the page renders.
  body: string;
  // Repo relative path, for error messages.
  file: string;
};

// A slug can't shadow a real page, or its short link (/<slug>) would hijack it.
function reservedSlugs(): Set<string> {
  const names = new Set(["api", "_next"]);
  for (const dir of [path.join(root, "app"), path.join(root, "app", "(site)"), path.join(root, "public")]) {
    // Only runs at build time; keeps Turbopack from bundling the whole repo.
    if (!fs.existsSync(/*turbopackIgnore: true*/ dir)) continue;
    for (const entry of fs.readdirSync(/*turbopackIgnore: true*/ dir)) {
      names.add(entry.replace(/\.[a-z]+$/, ""));
    }
  }
  return names;
}

function formatIssues(error: z.ZodError): string[] {
  return error.issues.flatMap((issue) => {
    if (issue.code === "unrecognized_keys") {
      return issue.keys.map((key) => `${key}: not a field the site knows. Check the spelling against _template.mdx.`);
    }
    const where = issue.path.join(".");
    return where ? `${where}: ${issue.message}` : issue.message;
  });
}

// Loads every project file, published or not. Files starting with "_" (like
// the template) are skipped. Throws one error listing every problem in every
// file, so a bad edit fails the build with a clear message.
export function loadProjects(): Project[] {
  const files = fs
    .readdirSync(projectsDir)
    .filter((name) => name.endsWith(".mdx") && !name.startsWith("_"))
    .sort();
  const reserved = reservedSlugs();
  const projects: Project[] = [];
  const problems: string[] = [];

  for (const name of files) {
    const file = path.posix.join("content", "projects", name);
    const raw = fs.readFileSync(path.join(projectsDir, name), "utf8");

    let parsed: matter.GrayMatterFile<string>;
    try {
      parsed = matter(raw);
    } catch (error) {
      problems.push(`${file}\n  - frontmatter isn't valid YAML: ${(error as Error).message}`);
      continue;
    }

    const result = frontmatterSchema.safeParse(parsed.data);
    if (!result.success) {
      problems.push(`${file}\n${formatIssues(result.error).map((line) => `  - ${line}`).join("\n")}`);
      continue;
    }

    const data = result.data;
    const fileProblems: string[] = [];
    const expectedSlug = name.replace(/\.mdx$/, "");
    if (data.slug !== expectedSlug) {
      fileProblems.push(`slug: is "${data.slug}" but the file is named ${name}. They must match.`);
    }
    if (reserved.has(data.slug)) {
      fileProblems.push(`slug: "${data.slug}" is already used by a page or folder on the site. Pick another.`);
    }
    if (data.logo && !fs.existsSync(path.join(root, "public", data.logo))) {
      fileProblems.push(`logo: no file at public${data.logo}`);
    }
    if (fileProblems.length > 0) {
      problems.push(`${file}\n${fileProblems.map((line) => `  - ${line}`).join("\n")}`);
      continue;
    }

    const accent = data.accentColor?.toUpperCase() ?? colors.opperiodRed;
    projects.push({
      ...data,
      href: `/projects/${data.slug}`,
      accent,
      accentText: readableOn(accent),
      body: parsed.content,
      file,
    });
  }

  if (problems.length > 0) {
    throw new Error(`Project content has problems:\n\n${problems.join("\n\n")}\n`);
  }

  return projects.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}
