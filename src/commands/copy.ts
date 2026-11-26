import fs from "node:fs/promises";
import Path from "node:path";
import { IsParent } from "../utility/utility.js";

export async function copy(
  src: string,
  dest: string,
  option: { force: boolean },
) {
  try {
    const src_path = Path.resolve(src);
    const dest_path = Path.resolve(dest);

    
    const src_info = await fs.lstat(src_path);

    
    if (IsParent(src_path, process.cwd())) {
      throw new Error(
        `Cannot copy '${src_path}': it is an ancestor of the current working directory.`,
      );
    }

    
    const relative = Path.relative(src_path, dest_path);

    if (
      src_info.isDirectory() &&
      relative !== "" &&
      !relative.startsWith(".." + Path.sep) &&
      !Path.isAbsolute(relative)
    ) {
      throw new Error(`Cannot copy '${src_path}' into itself.`);
    }

    
    await fs.mkdir(dest_path, { recursive: true });

    
    const copy_dest = Path.join(dest_path, Path.basename(src_path));

    
    let destExists = false;

    try {
      await fs.lstat(copy_dest);
      destExists = true;
    } catch (e: any) {
      if (e.code !== "ENOENT") throw e;
    }

    
    if (destExists && !option.force) {
      const error: any = new Error(
        `File or folder already exists: '${copy_dest}'. Use '--force' to overwrite matching files and folders.`,
      );

      error.code = "EEXIST";
      throw error;
    }

  
    await fs.cp(src_path, copy_dest, {
      recursive: true,
      force: option.force,
      errorOnExist: !option.force,
    });

    console.log(`Copied '${src_path}' to '${copy_dest}'`);

    return true;
  } catch (e: any) {
    const code = e?.code?.toUpperCase();

    if (code === "ENOENT") {
      console.error(`Error: Invalid path '${e.path}'`);
    } else if (code === "EEXIST") {
      console.error(`Error: ${e.message}`);
    } else {
      console.error(`Error: ${e.message}`);
    }

    return false;
  }
}
