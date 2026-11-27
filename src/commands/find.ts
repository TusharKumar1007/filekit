import fs, { readdir } from "node:fs/promises";
import Path from "node:path";
import { errorC, linksOrInfoC } from "../utility/colors.js";

function matchesWildcard(name: string, pattern: WildCard): boolean {
  const fileName = name.toLowerCase();
  const wildcard = pattern.toLowerCase();

  if (wildcard.startsWith("*")) {
    const search = wildcard.slice(1);

    const extension = Path.extname(fileName);
    const nameWithoutExt = Path.basename(fileName, extension);

    return fileName.endsWith(search) || nameWithoutExt.endsWith(search);
  }

  if (wildcard.startsWith("?")) {
    const search = wildcard.slice(1);

    const extension = Path.extname(fileName);
    const nameWithoutExt = Path.basename(fileName, extension);

    return fileName.startsWith(search) || nameWithoutExt.startsWith(search);
  }

  return fileName === wildcard;
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
        options.full ? linksOrInfoC(`(${entry?.fullpath})`,true) : ""
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
      errorC("Path is not a directory");
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
    errorC(e instanceof Error ? e.message : "Something went wrong");

    process.exitCode = 1;
  }
}
