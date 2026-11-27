import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { errorC } from "../utility/colors.js";
import { linksOrInfoC } from "../utility/colors.js";

export async function open(filepath: string) {
  const fullPath = path.resolve(filepath);

  try {
    try {
      await fs.access(fullPath);
    } catch {
      throw new Error(
        `Path does not exist or is inaccessible: ${linksOrInfoC(fullPath, true)}`,
      );
    }

    let command: string;
    let args: string[];

    if (process.platform === "win32") {
      command = "explorer.exe";
      args = [fullPath];
    } else if (process.platform === "darwin") {
      command = "open";
      args = [fullPath];
    } else {
      command = "xdg-open";
      args = [fullPath];
    }

    const child = spawn(command, args, {
      detached: true,
      stdio: "ignore",
    });

    child.unref();
  } catch {
    throw new Error(`Invalid path: ${linksOrInfoC(fullPath, true)}`);
  }
}

export async function reveal(filepath: string): Promise<void> {
  const fullpath = path.resolve(filepath);
  let stat;
  try {
    try {
      stat = await fs.stat(fullpath);
    } catch {
      throw new Error(`Invalid Path: ${linksOrInfoC(fullpath, true)}`);
    }
    let args: string[];
    let command: string;

    if (stat.isDirectory()) {
      args = [fullpath];
    } else {
      args = ["/select,", fullpath];
    }

    if (process.platform === "win32") {
      command = "explorer.exe";
    } else if (process.platform === "darwin") {
      command = "open";
    } else {
      command = "xdg-open";
    }

    const child = spawn(command, args, {
      detached: true,
      stdio: "ignore",
    });

    child.unref();
  } catch (e: any) {
    errorC(e.message);
  }
}
