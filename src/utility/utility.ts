declare global {
  type FilePath = string;
  interface FileDetails {
    file_name: string;
    extension: string;
    file_size: string;
    created_at: string;
    modify_at: string;
    Type: "File" | "Folder";
    [key: string]: string;
  }
  type WildCard = `*.${string}` | `?${string}`;

  type Info = {
    Directory_Size: number;
    Num_File: number;
    Num_Folders: number;
  };
}

export function fileDetailPrinter(file_details: FileDetails) {
  for (let key of Object.keys(file_details)) {
    console.log(
      `${key
        .split("_")
        .map(
          (e: string) => e.slice(0, 1).toUpperCase() + e.slice(1).toLowerCase(),
        )
        .join(" ")}: ${file_details[key]}`,
    );
  }
}
