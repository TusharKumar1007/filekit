import fs, { readdir } from "node:fs/promises";
import Path from "node:path";

export async function printDirectory(
  path: string,
  options?: { full: boolean },
  prefix: string = "",
) {
  try {
    await fs.access(path);
  } catch (e: unknown) {
    console.error("Path does not exists");
  }

  try {
    const cur_dir = await readdir(path);
    if (cur_dir.length === 0) return;

    for (let idx = 0; idx < cur_dir.length; idx++) {
      let dir = cur_dir[idx];
      const isLast = idx === cur_dir.length - 1;
      const pointer = isLast ? "└── " : "├── ";
      const new_path = Path.join(path, `${dir}/`);
      console.log(
        `${prefix}${pointer}${dir} ${options?.full ? "(" + new_path + ")" : ""}`,
      );

      if ((await fs.stat(new_path)).isDirectory()) {
        const next_prefix = prefix + (isLast ? "    " : "│   ");
        await printDirectory(new_path, options, next_prefix);
      }
    }
  } catch (e: any) {
    console.error(e.message);
  }
}
