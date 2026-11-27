import fs from "node:fs/promises";
import Path from "node:path";
import { IsParent } from "../utility/utility.js";
import { errorC, sucessC, warningC, linksOrInfoC } from "../utility/colors.js";

export async function move(
  src: string,
  dest: string,
  option: { force: boolean },
) {
  try {
    const src_path = Path.resolve(src);
    const dest_path = Path.resolve(dest);

    const src_info = await fs.lstat(src_path);
    const dest_info = await fs.lstat(dest_path);

    if (!dest_info.isDirectory()) {
      throw new Error(`${linksOrInfoC(dest_path, true)} is not a directory.`);
    }

    if (IsParent(src_path, process.cwd())) {
      throw new Error(
        `Cannot move '${src_path}': it is an ancestor of the current working directory.`,
      );
    }

    const relative = Path.relative(src_path, dest_path);

    if (
      src_info.isDirectory() &&
      relative !== "" &&
      !relative.startsWith(".." + Path.sep) &&
      !Path.isAbsolute(relative)
    ) {
      throw new Error(
        `Cannot move '${linksOrInfoC(src_path, true)}' into itself.`,
      );
    }

    const dest_move_path = Path.join(dest_path, Path.basename(src_path));

    let destExists = false;

    try {
      await fs.lstat(dest_move_path);
      destExists = true;
    } catch (e: any) {
      if (e.code !== "ENOENT") throw e;
    }

    if (destExists && !option.force) {
      const error: any = new Error(
        `File or folder already exists: '${linksOrInfoC(dest_move_path, true)}'. Use '--force' to overwrite matching files.`,
      );

      error.code = "EEXIST";
      throw error;
    }

    // File overwrite
    if (destExists && option.force) {
      await fs.cp(src_path, dest_move_path, {
        recursive: true,
        force: true,
        errorOnExist: false,
      });

      await fs.rm(src_path, {
        recursive: true,
        force: true,
      });
    } else {
      await fs.rename(src_path, dest_move_path);
    }

    sucessC(
      `${option.force ? "Overwrite happend when moved" : "Moved"} '${linksOrInfoC(src_path, true)}' to '${linksOrInfoC(dest_path, true)}'`,
    );

    return true;
  } catch (e: any) {
    const code = e?.code?.toUpperCase();

    if (code === "ENOENT") {
      errorC(`Error: Invalid path '${linksOrInfoC(e.path)}'`);
    } else if (code === "EEXIST") {
      warningC(`Error: ${e.message}`);
    } else if (code === "EXDEV") {
      errorC("Error: Cannot move across different filesystems using rename.");
    } else {
      errorC(`Error: ${e.message}`);
    }

    process.exitCode = 1;
    return false;
  }
}
