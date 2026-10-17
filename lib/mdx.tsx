import "server-only";

import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { mdxComponents } from "@/components/mdx";

// Compiles a project's MDX body at build time. Imports aren't allowed in
// content; the building blocks in components/mdx.tsx are passed in instead.
export async function MdxBody({ source, file }: { source: string; file: string }) {
  let Content;
  try {
    ({ default: Content } = await evaluate(source, runtime));
  } catch (error) {
    throw new Error(
      `Couldn't read the page body in ${file} (line numbers start below the frontmatter): ${(error as Error).message}`,
    );
  }
  return (
    <div className="mdx-body">
      <Content components={mdxComponents} />
    </div>
  );
}
