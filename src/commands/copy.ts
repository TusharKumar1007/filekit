import fs from "node:fs/promises";
import Path from "node:path";
import { IsParent } from "../utility/utility.js";

export async function copy(src: string, dest: string) {
  try {
    const src_info = await fs.lstat(src);
    const src_path = Path.resolve(src);
    const dest_path = Path.resolve(dest);

    const isParent = IsParent(src_path, dest_path);
    if (isParent)
      throw new Error(
        `Cannot copy '${dest_path}': it is a parent of the current working directory.`,
      );

    if (src_info.isFile()) {
      await fs.mkdir(dest_path, { recursive: true });

      const file_dest = Path.join(dest_path, Path.basename(src_path));

      await fs.copyFile(src_path, file_dest);

      console.log(`Copied File '${src_path}' to '${file_dest}'`);
      return true;
    }

    if (src_info.isDirectory()) {
      const folder_dest = Path.join(dest_path, Path.basename(src_path));
      await fs.cp(src_path, folder_dest, { recursive: true });

      console.log(`Copied Folder '${src_path}' to '${dest_path}'`);
      return true;
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown Error";
    console.log(message);
    return false;
  }
}
