import fs from "node:fs/promises";
import Path from "node:path";
import { IsParent } from "../utility/utility.js";

export async function clear(path: string) {
  try {
    if (!path || !path.trim()) {
      throw new Error("Please provide a valid path.");
    }

    const full_path = Path.resolve(path);
    const cwd = Path.resolve(process.cwd());

    // Reject ancestors of current working directory
    const relative = Path.relative(full_path, cwd);

    const isParent: boolean = IsParent(relative);

    if (isParent) {
      throw new Error(
        `Cannot clear '${full_path}': it is an ancestor of the current working directory.`,
      );
    }

    // Reject filesystem root
    if (full_path === Path.parse(full_path).root) {
      throw new Error("Cannot clear a filesystem root.");
    }

    // Inspect target without following symlinks
    const info = await fs.lstat(full_path);

    if (info.isSymbolicLink()) {
      throw new Error(`'${full_path}' is a symbolic link. Operation rejected.`);
    }

    if (!info.isDirectory()) {
      throw new Error(`'${full_path}' is not a directory. Use delete instead.`);
    }

    // Read and remove contents
    const entries = await fs.readdir(full_path);

    if (entries.length === 0) {
      console.log(`'${full_path}' is already empty.`);
      return;
    }

    for (const item of entries) {
      const new_path = Path.join(full_path, item);
      await fs.rm(new_path, { recursive: true });
    }

    console.log(`Folder cleared at '${full_path}'`);
  } catch (e) {
    console.error(`Error: ${e instanceof Error ? e.message : "Unknown error"}`);
    process.exitCode = 1;
  }
}

export async function deleteAt(path: string) {
  try {
    if (!path || !path.trim()) {
      throw new Error("Please provide a valid path.");
    }

    const full_path = Path.resolve(path);
    const cwd = Path.resolve(process.cwd());

    // Reject the current working directory
    if (full_path === cwd) {
      throw new Error("Cannot delete the current working directory.");
    }

    // Check whether target is an ancestor of cwd
    const relative = Path.relative(full_path, cwd);

    const isParent = IsParent(relative);

    if (isParent) {
      throw new Error(
        `Cannot delete '${full_path}': it is a parent of the current working directory.`,
      );
    }

    // Prevent filesystem root deletion
    if (full_path === Path.parse(full_path).root) {
      throw new Error("Cannot delete a filesystem root.");
    }

    // Inspect target
    const info = await fs.lstat(full_path);

    if (info.isSymbolicLink()) {
      throw new Error(`'${full_path}' is a symbolic link. Operation rejected.`);
    }

    await fs.rm(full_path, { recursive: true });

    console.log(`Deleted '${full_path}'`);

    return true;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown filesystem error";

    console.error(`Error: ${message}`);
  }
}
