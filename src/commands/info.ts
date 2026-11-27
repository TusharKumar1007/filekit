import path from "path";
import fs from "fs/promises";
import { getDirectorySize } from "./tree.js";
import { fileExtensions } from "../utility/info.js";

async function getMetaData(filepath: FilePath) {
  const data = await fs.stat(filepath);
  return data;
}

export async function getFileMetaDataObj(
  filepath: FilePath,
  size: "Bytes" | "KB" | "MB" | "GB" = "Bytes",
) {
  if (!filepath) throw new Error("No file path provided.");
  const data = await getMetaData(filepath);

  const file_details = {} as FileDetails;

  file_details.file_name = path.basename(
    [".", "./"].includes(filepath) ? process.cwd() : filepath,
  );

  const extention = path.extname(filepath) as ExtentionType;

  file_details.Type = data.isFile()
    ? `${fileExtensions[extention] ? fileExtensions[extention] : "Unknown"} File`
    : "Folder";
  file_details.Location = path.resolve(filepath);
  file_details.created_at = data.birthtime.toLocaleString();
  file_details.modify_at = data.mtime.toLocaleString();

  if (!data.isDirectory()) {
    file_details.extension = extention
      ? `${extention} (${fileExtensions[extention]})`
      : "None";
    file_details.file_size = `${size !== "Bytes" ? (size === "KB" ? data.size / 1024 : size === "MB" ? data.size / 1024 ** 2 : data.size / 1024 ** 3).toFixed(2) : data.size} ${size}`;

    return file_details;
  }
  const { files, folders, total_size } = await getDirectorySize(filepath);
  file_details.file_size = `${size !== "Bytes" ? (size === "KB" ? total_size / 1024 : size === "MB" ? total_size / 1024 ** 2 : total_size / 1024 ** 3).toFixed(2) : total_size} ${size}`;
  file_details.Files = `${files}`;
  file_details.Folders = `${folders}`;

  return file_details;
}
