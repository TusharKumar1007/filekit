import fs from "node:fs/promises";
import Path from "node:path";

type CreateOptions = {
  force: boolean;
};

export async function createFolder(path: string) {
  try {
    const full_path = Path.resolve(path);

    await fs.mkdir(full_path);

    console.log(`Folder created at ${full_path}`);
    return true;
  } catch (e: any) {
    if (e?.code === "EEXIST") {
      console.log(`Folder already exists: ${Path.resolve(path)}`);
    } else if (e?.code === "ENOENT") {
      console.log(`Parent directory does not exist: ${e.path}`);
    } else {
      console.error(`Error: ${e?.message ?? "Unknown error"}`);
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

    console.log(`File created at ${file_path}`);
    return true;
  } catch (e: any) {
    if (e?.code === "EEXIST") {
      console.log(`File already exists: ${Path.resolve(path)}`);
    } else if (e?.code === "ENOENT") {
      console.log(
        `Parent directory does not exist: ${Path.dirname(Path.resolve(path))}. Use '--force' to create it.`,
      );
    } else if (e?.code === "EISDIR") {
      console.log(
        `Cannot create file: path is a directory: ${Path.resolve(path)}`,
      );
    } else if (e?.code === "EACCES" || e?.code === "EPERM") {
      console.log(`Permission denied: ${Path.resolve(path)}`);
    } else {
      console.error(`Error: ${e?.message ?? "Unknown error"}`);
    }

    return false;
  }
}

export async function createFile(path: string, options: CreateOptions) {
  return createSingleFile(path, options);
}

export async function createFiles(paths: string[], options: CreateOptions) {
  if (paths.length === 0) {
    console.error("Error: No file paths provided.");
    return false;
  }

  const results: boolean[] = [];

  for (const path of paths) {
    results.push(await createSingleFile(path, options));
  }

  return results.every(Boolean);
}
