import { fileDetailPrinter, getFileMetaDataObj } from "./utility.js";

const command_list = ["info"];

if (process.argv[2]) {
  if (command_list.includes(process.argv[2].toLowerCase())) {
    try {
      if (process.argv[3]) {
        fileDetailPrinter(await getFileMetaDataObj(process.argv[3]));
      }
    } catch (e: any) {
      console.error(e.message);
    }
  }else{
    
  }
}
