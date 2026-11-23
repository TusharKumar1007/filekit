import { Command } from "commander";
import { fileDetailPrinter } from "../utility/utility.js";
import { getFileMetaDataObj } from "./info.js";
import { printDirectory } from "./tree.js";

const commandListObj = {
  info: "Show meta data of file. (e.g size,modified at,created at,extention). e.g --> filekit info FILEPATH",
  tree: "Prints all nested item in specified path in a tree format. e.g --> filekit tree PATH",
};

const program = new Command();

program
  .name("filekit")
  .description("A command line toolkit for working with files")
  .version("0.1.0");

program
  .command("info")
  .description(commandListObj.info)
  .option("--json", "outputs in JSON format")
  .option("--mb", "outputs size in  mb")
  .option("--gb", "outputs size in  gb")
  .argument("<path>", "Path to the file")
  .action(async (filepath: string, options) => {
    try {
      const data = await getFileMetaDataObj(
        filepath,
        options.mb ? "MB" : options.gb ? "GB" : "KB",
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
        await printDirectory(path, (options = { full: options.full }));
      } else {
        await printDirectory(path);
      }
    } catch (e: any) {
      console.error(e.message);
    }
  });

await program.parseAsync(process.argv);
