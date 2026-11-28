import fs from "node:fs/promises";
import Path from "node:path";
import { errorC, linksOrInfoC, sucessC, warningC } from "../utility/colors.js";

import { getHash } from "../utility/gethash.js";

export async function getDuplicates(path: string): Promise<DuplicatesMap> {
  const duplicates: DuplicatesMap = new Map();

  try {
    const fullPath = Path.resolve(path);

    const stat = await fs.stat(fullPath);

    if (!stat.isDirectory()) {
      throw new Error(`Path is not a directory: ${fullPath}`);
    }

    const cur_dir = await fs.readdir(fullPath, {
      withFileTypes: true,
    });

    for (const dir of cur_dir) {
      const currentPath = Path.join(fullPath, dir.name);

      if (dir.isDirectory()) {
        const nestedDuplicates = await getDuplicates(currentPath);

        for (const [hash, files] of nestedDuplicates) {
          if (duplicates.has(hash)) {
            duplicates.get(hash)!.push(...files);
          } else {
            duplicates.set(hash, [...files]);
          }
        }
      } else if (dir.isFile()) {
        const hash = await getHash(currentPath);

        if (duplicates.has(hash)) {
          duplicates.get(hash)!.push(currentPath);
        } else {
          duplicates.set(hash, [currentPath]);
        }
      }
    }

    return duplicates;
  } catch (error: unknown) {
    if (error instanceof Error) {
      errorC(`Unable to scan directory '${path}': ${error.message}`);
    }

    throw error;
  }
}

export async function printDuplicateInfo(duplicates: DuplicatesMap) {
  try {
    let groupNumber = 1;
    let duplicateGroups = 0;
    let duplicateFiles = 0;
    let wastedSpace = 0;

    for (const [hash, files] of duplicates) {
      if (files.length > 1) {
        duplicateGroups++;
        duplicateFiles += files.length;

        warningC(`Duplicate Group ${groupNumber++}`);
        console.log(`Hash: ${hash}`);

        for (const file of files) {
          linksOrInfoC(`  - ${file}`);
        }

        const stat = await fs.stat(files[0]!);

        const savedSpace = stat.size * (files.length - 1);

        wastedSpace += savedSpace;

        sucessC(
          `  Disk space wasted: ${(savedSpace / 1024 ** 2).toFixed(2)} MB\n`,
        );
      }
    }

    if (duplicateGroups === 0) {
      sucessC("No duplicate files found!");
      return;
    }

    console.log("\n========== Summary ==========");

    console.log(`Duplicate groups: ${duplicateGroups}`);
    console.log(`Duplicate files: ${duplicateFiles}`);

    sucessC(`Total wasted space: ${(wastedSpace / 1024 ** 2).toFixed(2)} MB`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      errorC(`Unable to print duplicate information: ${error.message}`);
    }

    throw error;
  }
}
