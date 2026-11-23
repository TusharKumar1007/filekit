import path from "path";
import fs from "fs/promises";
import { getDirectorySize } from "./tree.js";

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
  file_details.Type = data.isFile() ? "File" : "Folder";
  file_details.modify_at = data.mtime.toLocaleString();
  file_details.created_at = data.birthtime.toLocaleString();

  if (!data.isDirectory()) {
    file_details.extension = path.extname(filepath)
      ? path.extname(filepath)
      : "None";
    file_details.file_size = `${(size === "KB" ? data.size / 1024 : data.size / 1024 ** 2).toFixed(2)} ${size}`;

    return file_details;
  }
  const sizeInBytes = (await getDirectorySize(filepath)) as number;
  file_details.file_size = `${(size === "KB" ? sizeInBytes / 1024 : sizeInBytes / 1024 ** 2).toFixed(2)} ${size}`;

  return file_details;
}
