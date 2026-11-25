import fs from "node:fs/promises";
import Path from "node:path";

export async function copy(what_path: string, where_path: string) {
  try {
    const dest_path = Path.resolve(where_path);
    const src_path = Path.resolve(what_path);
    const src = await fs.lstat(what_path);
    const dest = await fs.lstat(where_path);
    if (!dest.isDirectory()) {
      throw new Error(`${dest_path} is not a Folder`);
    }
    if (src.isFile()) {
      await fs.copyFile(what_path, where_path);
      console.log(`File '${src_path}' moved to '${dest_path}'`);
      return true;
    }
    await fs.cp(what_path, where_path);
    console.log(`Folder '${src_path}' moved to '${dest_path}'`);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown Error";
    console.log(`Error: ${message}`);
    return false;
  }
}
