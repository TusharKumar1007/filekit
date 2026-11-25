import fs from "node:fs/promises";
import Path from "node:path";

export async function createFolder(path: string) {
  try {
    const full_path = Path.resolve(path);

    const base_folder_info = await fs.readdir(Path.dirname(path));

    if (base_folder_info.includes(Path.basename(path))) {
      throw {
        message: "Folder already exists",
        code: "EEXIST",
        path: full_path,
      };
    }
    await fs.mkdir(full_path, { recursive: true });
    console.log(`Folder crated at ${full_path}`);
  } catch (e: any) {
    if (e instanceof Error) {
      console.log(e.message);
      return false;
    }
    if (e.code.toLowerCase() === "eexist") {
      console.log(`Folder already exists ${e.path}`);
      return false;
    }
    console.log(e);
  }
}
export async function createFile(path: string, options: { force: boolean }) {
  try {
    const dir_path = Path.resolve(Path.dirname(path));
    const file_path = Path.resolve(path);
    if (options.force) {
      await createFolder(dir_path);
    }

    await fs.access(dir_path);

    const dir_details = await fs.readdir(dir_path);

    if (dir_details.includes(Path.basename(file_path))) {
      throw {
        message: "File already exists",
        code: "EEXIST",
        path: file_path,
      };
    }
    await fs.writeFile(file_path, "");
    console.log(`File crated at ${file_path}`);
  } catch (e: any) {
    if (e.code.toLowerCase() === "eexist") {
      console.log(`${e.message}, ${e.path}`);
    } else if (e.code.toLowerCase() === "enoent") {
      console.log(
        `Path you are trying to create file at, does not exists. ${e.path}. Use '--force' to create file with path`,
      );
    } else {
      console.log(e);
    }

    return false;
  }
}
