import fs, { readdir } from "node:fs/promises";
import Path from "node:path";

let Directory_Size: number = 0;
let Num_File: number = 0;
let Num_Folders: number = 0;


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

export async function getDirectorySize(
  path: string,
): Promise<Info | undefined> {
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
      const new_path = Path.join(path, `${dir}/`);
      if ((await fs.stat(new_path)).isFile()) {
        Directory_Size += (await fs.stat(new_path)).size;
        Num_File += 1;
      }

      if ((await fs.stat(new_path)).isDirectory()) {
        Num_Folders += 1;
        await getDirectorySize(new_path);
      }
    }
    return { Directory_Size, Num_Folders, Num_File };
  } catch (e: any) {
    console.error(e.message);
  }
}
