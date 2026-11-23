
import fs, { readdir } from "node:fs/promises";
import Path from "node:path";

// Wildcard matching
function matchesWildcard(name: string, pattern: WildCard): boolean {


  // Find files ending with a specific extension
  if (pattern.startsWith("*")) {
    return name.endsWith(pattern.slice(1));
  }

  // Find files starting with a specific name
  if (pattern.startsWith("?")) {
    return name.startsWith(pattern.slice(1));
  }

  return name === pattern;
}

type TreeEntry = {
  name: string;
  fullpath: string;
  isDirectory: boolean;
  children?: TreeEntry[];
};

// Recursively build a filtered directory tree
async function buildTree(
  path: string,
  wildcard: WildCard,
): Promise<TreeEntry[]> {
  const entries = await readdir(path);
  const results: TreeEntry[] = [];

  for (const entry of entries) {
    const fullpath = Path.join(path, entry);
    const stat = await fs.stat(fullpath);

    if (stat.isDirectory()) {
      const children = await buildTree(fullpath, wildcard);

      // Include only directories containing matching files
      if (children.length > 0) {
        results.push({
          name: entry,
          fullpath,
          isDirectory: true,
          children,
        });
      }
    } else if (matchesWildcard(entry, wildcard)) {
      results.push({
        name: entry,
        fullpath,
        isDirectory: false,
      });
    }
  }

  return results;
}

// Print the directory tree
function printTree(
  entries: TreeEntry[],
  options: { full: boolean },
  prefix = "",
): void {
  for (let idx = 0; idx < entries.length; idx++) {
    const entry = entries[idx];
    const isLast = idx === entries.length - 1;

    const pointer = isLast ? "└── " : "├── ";

    console.log(
      `${prefix}${pointer}${entry?.name}${
        options.full ? ` (${entry?.fullpath})` : ""
      }`,
    );

    if (entry?.isDirectory && entry?.children) {
      const newPrefix = prefix + (isLast ? "     " : "│    ");

      printTree(entry?.children, options, newPrefix);
    }
  }
}

// Main find function
export async function findIn(
  path: string,
  wildCard: WildCard,
  options: { full: boolean },
): Promise<void> {
  try {
    await fs.access(path);

    const stat = await fs.stat(path);

    if (!stat.isDirectory()) {
      console.error("Path is not a directory");
      process.exitCode = 1;
      return;
    }

    const tree = await buildTree(path, wildCard);

    if (tree.length === 0) {
      console.log("No matching files found.");
      return;
    }

    printTree(tree, options);
  } catch (e: unknown) {
    console.error(
      e instanceof Error ? e.message : "Something went wrong",
    );

    process.exitCode = 1;
  }
}
