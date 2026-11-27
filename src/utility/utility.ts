import Path from "node:path";
import { fileExtensions } from "./info.js";
import { greyC } from "./colors.js";

declare global {
  type FilePath = string;
  interface FileDetails {
    file_name: string;
    extension: string;
    file_size: string;
    created_at: string;
    modify_at: string;
    Type: `${string} File` | "Folder";
    [key: string]: string;
  }
  type WildCard = `*.${string}` | `?${string}`;

  type Info = {
    Directory_Size: number;
    Num_File: number;
    Num_Folders: number;
  };

  type ExtentionType = keyof typeof fileExtensions;
}

export function fileDetailPrinter(file_details: FileDetails) {
  for (let key of Object.keys(file_details)) {
    console.log(
      `${greyC(
        key
          .split("_")
          .map(
            (e: string) =>
              e.slice(0, 1).toUpperCase() + e.slice(1).toLowerCase(),
          )
          .join(" "),
        true,
      )}: ${file_details[key]}`,
    );
  }
}

export function IsParent(full_path: string, cwd: string): boolean {
  const relative = Path.relative(full_path, cwd);
  return (
    relative !== "" &&
    relative !== ".." &&
    !relative.startsWith(`..${Path.sep}`) &&
    !Path.isAbsolute(relative)
  );
}
