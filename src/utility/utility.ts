import path from "path";
import fs from "fs/promises";

type FilePath = string;
interface FileDetails {
  file_name: string;
  extension: string;
  file_size: string;
  created_at: string;
  modify_at: string;
  Type: "File" | "Folder";
  [key: string]: string;
}

async function getMetaData(filepath: FilePath) {
  const data = await fs.stat(filepath);
  return data;
}

export async function getFileMetaDataObj(
  filepath: FilePath,
  size: "KB" | "MB" = "KB",
) {
  if (!filepath) throw new Error("No file path provided.");
  const data = await getMetaData(filepath);

  const file_details = {} as FileDetails;

  file_details.file_name = path.basename(filepath);
  file_details.extension = path.extname(filepath)
    ? path.extname(filepath)
    : "None";
  file_details.file_size = `${(size === "KB" ? data.size / 1024 : data.size / 1024 ** 2).toFixed(2)} ${size}`;
  file_details.created_at = data.birthtime.toLocaleString();
  file_details.modify_at = data.mtime.toLocaleString();
  file_details.Type = data.isFile() ? "File" : "Folder";

  return file_details;
}

export function fileDetailPrinter(file_details: FileDetails) {
  for (let key of Object.keys(file_details)) {
    console.log(
      `${key
        .split("_")
        .map(
          (e: string) => e.slice(0, 1).toUpperCase() + e.slice(1).toLowerCase(),
        )
        .join(" ")}: ${file_details[key]}`,
    );
  }
}
