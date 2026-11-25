import { Command } from "commander";
import { fileDetailPrinter } from "../utility/utility.js";
import { getFileMetaDataObj } from "./info.js";
import { printDirectory } from "./tree.js";
import { findIn } from "./find.js";
import { open, reveal } from "./open.js";
import { commandListObj } from "../utility/utility.js";
import { clear, deleteAt } from "./delete.js";
import { copy } from "./copy.js";

const program = new Command();

program
  .name("filekit")
  .description("A command line toolkit for working with files")
  .version("0.1.0");

program
  .command("info")
  .description(commandListObj.info)
  .option("--json", "outputs in JSON format")
  .option("--kb", "outputs size in  kb")
  .option("--mb", "outputs size in  mb")
  .option("--gb", "outputs size in  gb")
  .argument("<path>", "Path to the file")
  .action(async (filepath: string, options) => {
    try {
      const data = await getFileMetaDataObj(
        filepath,
        options.mb ? "MB" : options.gb ? "GB" : options.kb ? "KB" : "Bytes",
      );

      if (options.json) {
        console.log(JSON.stringify(data, null, 2));
      } else {
        fileDetailPrinter(data);
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message);
      } else {
        console.error("An unexpexted error occured");
      }
      process.exitCode = 1;
    }
  });

program
  .command("tree")
  .description(commandListObj.tree)
  .option("--full", "Show full path after every file | folder.")
  .argument("<path>", "Folder Path")
  .action(async (path, options) => {
    try {
      if (options.full) {
        await printDirectory(path, options);
      } else {
        await printDirectory(path);
      }
    } catch (e: any) {
      console.error(e.message);
    }
  });

program
  .command("findin")
  .description(commandListObj.findin)
  .argument("<path>", "Search folder path")
  .argument("<wildcard>", "wild card with name")
  .option("--full", "Show full path after every file | folder.")
  .action(async (filepath, wildcard, options) => {
    await findIn(filepath, wildcard, options);
  });

program
  .command("open")
  .description(commandListObj.open)
  .argument("<path>", "Path of File or folder you want open")
  .action(async (filepath) => {
    await open(filepath);
  });

program
  .command("reveal")
  .description(commandListObj.reveal)
  .argument("<path>", "Reveals the file in folder")
  .action(async (filepath) => {
    await reveal(filepath);
  });

program
  .command("clear")
  .description(commandListObj.clear)
  .argument("<path>", "Path to the folder you want to clear.")
  .action(async (filepath) => {
    await clear(filepath);
  });

program
  .command("delete")
  .description(commandListObj.delete)
  .argument("<path>", "Path to the folder you want to delete.")
  .action(async (filepath) => {
    await deleteAt(filepath);
  });
program
  .command("copy")
  .description(commandListObj.copy)
  .argument("<source path>", "Path of the file or folder you want to copy.")
  .argument("<destination path>", "Path to the folder you want to copy it to.")
  .action(async (src, dest) => {
    await copy(src, dest);
  });

await program.parseAsync(process.argv);
