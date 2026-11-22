import {
  fileDetailPrinter,
  getFileMetaDataObj,
  commandListPrinter,
} from "./utility.js";

const commandListObj = {
  info: "show meta data of file. (e.g size,modified at,created at,extention). e.g --> filekit info FILEPATH",
};

if (process.argv[2]) {
  if (Object.keys(commandListObj).includes(process.argv[2].toLowerCase())) {
    try {
      if (process.argv[3]) {
        fileDetailPrinter(await getFileMetaDataObj(process.argv[3]));
      }else{
        console.error("No path specified, run `filekit` to see implementation");
        
      }
    } catch (e: any) {
      console.error(e.message);
    }
  } else {
    console.log(`command not found, to view list of commands run 'filekit'`);
  }
} else {
  commandListPrinter(commandListObj);
}
