import fs from "node:fs/promises";
import Path from "node:path";
import { IsParent } from "../utility/utility.js";
import { sucessC, errorC, warningC, linksOrInfoC } from "../utility/colors.js";

export async function copy(
  src: string,
  dest: string,
  option: { force?: boolean } = {},
) {
  option.force = option.force ?? false;
  try {
    const src_path = Path.resolve(src);
    const dest_path = Path.resolve(dest);

    const src_info = await fs.lstat(src_path);

    if (IsParent(src_path, process.cwd())) {
      throw new Error(
        `Cannot copy '${linksOrInfoC(src_path, true)}': it is an ancestor of the current working directory.`,
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
        `Cannot copy '${linksOrInfoC(src_path, true)}' into itself.`,
      );
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
        `File or folder already exists: '${linksOrInfoC(copy_dest, true)}'. Use ${linksOrInfoC(`'--force'`, true)} to overwrite matching files and folders.`,
      );

      error.code = "EEXIST";
      throw error;
    }

    await fs.cp(src_path, copy_dest, {
      recursive: true,
      force: option.force,
      errorOnExist: !option.force,
    });

    sucessC(
      `Copied '${linksOrInfoC(src_path, true)}' to '${linksOrInfoC(copy_dest, true)}'`,
    );

    return true;
  } catch (e: any) {
    const code = e?.code?.toUpperCase();

    if (code === "ENOENT") {
      errorC(`Error: Invalid path '${e.path}'`);
    } else if (code === "EEXIST") {
      warningC(`Error: ${e.message}`);
    } else {
      errorC(`Error: ${e.message}`);
    }

    return false;
  }
}
