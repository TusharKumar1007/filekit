import { Command } from "commander";
import { fileDetailPrinter } from "../utility/utility.js";
import { getFileMetaDataObj } from "./info.js";

const commandListObj = {
  info: "show meta data of file. (e.g size,modified at,created at,extention). e.g --> filekit info FILEPATH",
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
  .argument("<path>", "Path to the file")
  .action(async (filepath: string, options) => {
    try {
      const data = await getFileMetaDataObj(filepath, options.mb ? "MB" : "KB");

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

await program.parseAsync(process.argv);
