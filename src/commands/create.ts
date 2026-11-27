import fs from "node:fs/promises";
import Path from "node:path";
import { errorC, linksOrInfoC, sucessC, warningC } from "../utility/colors.js";

type CreateOptions = {
  force: boolean;
};

export async function createFolder(path: string) {
  try {
    const full_path = Path.resolve(path);

    await fs.mkdir(full_path);

    sucessC(`Folder created at ${linksOrInfoC(full_path, true)}`);
    return true;
  } catch (e: any) {
    if (e?.code === "EEXIST") {
      warningC(`Folder already exists: ${Path.resolve(path)}`);
    } else if (e?.code === "ENOENT") {
      warningC(`Parent directory does not exist: ${e.path}`);
    } else {
      errorC(`Error: ${e?.message ?? "Unknown error"}`);
    }

    return false;
  }
}

async function createSingleFile(path: string, options: CreateOptions) {
  try {
    const file_path = Path.resolve(path);
    const dir_path = Path.dirname(file_path);

    if (options.force) {
      await fs.mkdir(dir_path, { recursive: true });
    }

    await fs.writeFile(file_path, "", { flag: "wx" });

    sucessC(`File created at ${file_path}`);
    return true;
  } catch (e: any) {
    if (e?.code === "EEXIST") {
      warningC(`File already exists: ${Path.resolve(path)}`);
    } else if (e?.code === "ENOENT") {
      errorC(
        `Parent directory does not exist: ${Path.dirname(Path.resolve(path))}. Use ${linksOrInfoC(`'--force'`, true)} to create it.`,
      );
    } else if (e?.code === "EISDIR") {
      warningC(
        `Cannot create file: path is a directory: ${Path.resolve(path)}`,
      );
    } else if (e?.code === "EACCES" || e?.code === "EPERM") {
      warningC(`Permission denied: ${Path.resolve(path)}`);
    } else {
      errorC(`Error: ${e?.message ?? "Unknown error"}`);
    }

    return false;
  }
}

export async function createFile(path: string, options: CreateOptions) {
  return createSingleFile(path, options);
}

export async function createFiles(paths: string[], options: CreateOptions) {
  if (paths.length === 0) {
    errorC("Error: No file paths provided.");
    return false;
  }

  const results: boolean[] = [];

  for (const path of paths) {
    results.push(await createSingleFile(path, options));
  }

  return results.every(Boolean);
}
