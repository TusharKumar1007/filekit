import fs from "node:fs/promises";
import { spawn } from "node:child_process";
import path, { win32 } from "node:path";
import { Command } from "commander";

export async function open(filepath: string) {
  const fullPath = path.resolve(filepath);

  try {
    try {
      await fs.access(fullPath);
    } catch {
      throw new Error(`Path does not exist or is inaccessible: ${fullPath}`);
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
    throw new Error(`Invalid path: ${fullPath}`);
  }
}

export async function reveal(filepath: string): Promise<void> {
  const fullpath = path.resolve(filepath);
  let stat;
  try {
    try {
      stat = await fs.stat(fullpath);
    } catch {
      throw new Error(`Invalid Path: ${fullpath}`);
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
    console.error(e.message);
  }
}
