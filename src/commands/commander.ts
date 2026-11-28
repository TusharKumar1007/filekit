import { Command, Option } from "commander";
import { fileDetailPrinter } from "../utility/utility.js";
import { commandListObj } from "../utility/info.js";
import { copy } from "./copy.js";
import { createFiles, createFolder } from "./create.js";
import { clear, deleteAt } from "./delete.js";
import { findIn } from "./find.js";
import { getFileMetaDataObj } from "./info.js";
import { move } from "./move.js";
import { open, reveal } from "./open.js";
import { printDirectory } from "./tree.js";
import { measureTime } from "../utility/timer.js";
import { errorC,linksOrInfoC, sucessC } from "../utility/colors.js";
import { getDuplicates, printDuplicateInfo } from "../commands/duplicates.js";

const program = new Command();

program
  .name("filekit")
  .description("A command line toolkit for working with files")
  .version("1.0.1");

program
  .command("info")
  .description(commandListObj.info)
  .option("--json", "outputs in JSON format")
  .option("--kb", "outputs size in  kb")
  .option("--mb", "outputs size in  mb")
  .option("--gb", "outputs size in  gb")
  .option("--time", "outputs Execution time")
  .argument("<path>", "Path to the file")
  .action(async (filepath: string, options) => {
    await measureTime(async () => {
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
      } catch (e: any) {
        if (e.code.toLowerCase() === "enoent") {
          errorC(
            `Invalid Path no such file or directory: ${linksOrInfoC(e.path, true)}`,
          );
        } else if (e instanceof Error) {
          errorC(e.message);
        } else {
          errorC("An unexpexted error occured");
        }
        process.exitCode = 1;
      }
    }, options.time);
  });

program
  .command("tree")
  .description(commandListObj.tree)
  .option("--full", "Show full path after every file | folder.")
  .option("--time", "outputs Execution time")
  .argument("<path>", "Folder Path")
  .action(async (path, options) => {
    await measureTime(async () => {
      try {
        if (options.full) {
          await printDirectory(path, options);
        } else {
          await printDirectory(path);
        }
      } catch (e: any) {
        errorC(e.message);
      }
    }, options.time);
  });

program
  .command("findin")
  .description(commandListObj.findin)
  .argument("<path>", "Search folder path")
  .argument("<wildcard>", "wild card with name")
  .option("--full", "Show full path after every file | folder.")
  .option("--time", "outputs Execution time")
  .action(async (filepath, wildcard, options) => {
    await measureTime(async () => {
      await findIn(filepath, wildcard, options);
    }, options.time);
  });

program
  .command("open")
  .description(commandListObj.open)
  .argument("<path>", "Path of File or folder you want open")
  .option("--time", "outputs Execution time")
  .action(async (filepath, options) => {
    await measureTime(async () => {
      await open(filepath);
    }, options.time);
  });

program
  .command("reveal")
  .description(commandListObj.reveal)
  .argument("<path>", "Reveals the file in folder")
  .option("--time", "outputs Execution time")
  .action(async (filepath, options) => {
    await measureTime(async () => {
      await reveal(filepath);
    }, options.time);
  });

program
  .command("clear")
  .description(commandListObj.clear)
  .argument("<path>", "Path to the folder you want to clear.")
  .option("--time", "outputs Execution time")
  .action(async (filepath, options) => {
    await measureTime(async () => {
      await clear(filepath);
    }, options.time);
  });

program
  .command("delete")
  .description(commandListObj.delete)
  .argument("<path>", "Path to the folder you want to delete.")
  .option("--time", "outputs Execution time")
  .action(async (filepath, options) => {
    await measureTime(async () => {
      await deleteAt(filepath);
    }, options.time);
  });
program
  .command("copy")
  .description(commandListObj.copy)
  .argument("<source path>", "Path of the file or folder you want to copy.")
  .argument("<destination path>", "Path to the folder you want to copy it to.")
  .option("--force", "Overwrites already existing file or folder.")
  .option("--time", "outputs Execution time")
  .action(
    async (
      src: string,
      dest: string,
      options: { force: boolean; time: boolean },
    ) => {
      await measureTime(async () => {
        await copy(src, dest, options);
      }, options.time);
    },
  );
program
  .command("mkdir")
  .description(commandListObj.mkdir)
  .argument("<path>", "Path to the folder you want to create.")
  .option("--time", "outputs Execution time")
  .action(async (path: string, options) => {
    await measureTime(async () => {
      await createFolder(path);
    }, options.time);
  });
program
  .command("touch")
  .description(commandListObj.touch)
  .argument("<path...>", "Path to the file you want to create.")
  .option("--force", "Builds the path to achive file creation.")
  .option("--time", "outputs Execution time")
  .action(
    async (paths: string[], option: { force: boolean; time: boolean }) => {
      await measureTime(async () => {
        await createFiles(paths, option);
      }, option.time);
    },
  );
program
  .command("move")
  .description(commandListObj.move)
  .argument("<source path>", "Path to the file or folder you want to move.")
  .argument("<destination path>", "Path to the folder you want to move to.")
  .option("--force", "Overwrites already existing file or folder")
  .option("--time", "outputs Execution time")
  .action(
    async (
      src: string,
      dest: string,
      option: { force: boolean; time: boolean },
    ) => {
      await measureTime(async () => {
        await move(src, dest, option);
      }, option.time);
    },
  );
program
  .command("duplicate")
  .description(commandListObj.duplicate)
  .argument("<path>", "Path to the folder you want to check duplicates in.")
  .option("--time", "outputs Execution time")
  .action(async (path: string, option: { time: boolean }) => {
    await measureTime(async () => {
      sucessC("finding duplicates...\n")
      const info = (await getDuplicates(path)) as DuplicatesMap;
      await printDuplicateInfo(info);
    }, option.time);
  });

await program.parseAsync(process.argv);
