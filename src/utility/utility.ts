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

  type ExtentionType=keyof typeof fileExtensions;
}

export const fileExtensions = {
  ".js": "JavaScript",
  ".mjs": "JavaScript",
  ".cjs": "JavaScript",
  ".jsx": "JavaScript React",
  ".ts": "TypeScript",
  ".tsx": "TypeScript React",
  ".html": "HTML",
  ".htm": "HTML",
  ".css": "CSS",
  ".scss": "SCSS",
  ".sass": "Sass",
  ".less": "Less",
  ".json": "JSON",
  ".xml": "XML",
  ".yaml": "YAML",
  ".yml": "YAML",
  ".md": "Markdown",
  ".mdx": "MDX",
  ".txt": "Plain Text",
  ".py": "Python",
  ".pyw": "Python",
  ".java": "Java",
  ".class": "Java",
  ".jar": "Java Archive",
  ".c": "C",
  ".h": "C Header",
  ".cpp": "C++",
  ".cc": "C++",
  ".hpp": "C++ Header",
  ".cs": "C#",
  ".go": "Go",
  ".rs": "Rust",
  ".rb": "Ruby",
  ".php": "PHP",
  ".swift": "Swift",
  ".kt": "Kotlin",
  ".kts": "Kotlin",
  ".dart": "Dart",
  ".lua": "Lua",
  ".r": "R",
  ".R": "R",
  ".sql": "SQL",
  ".sh": "Shell Script",
  ".bash": "Bash",
  ".zsh": "Zsh",
  ".ps1": "PowerShell",
  ".bat": "Batch File",
  ".cmd": "Command Script",
  ".vue": "Vue",
  ".svelte": "Svelte",
  ".astro": "Astro",
  ".graphql": "GraphQL",
  ".gql": "GraphQL",
  ".dockerfile": "Dockerfile",
  ".toml": "TOML",
  ".ini": "INI",
  ".env": "Environment File",
  ".pdf": "PDF",
  ".doc": "Word Document",
  ".docx": "Word Document",
  ".xls": "Excel Spreadsheet",
  ".xlsx": "Excel Spreadsheet",
  ".ppt": "PowerPoint",
  ".pptx": "PowerPoint",
  ".csv": "CSV",
  ".tsv": "TSV",
  ".png": "PNG Image",
  ".jpg": "JPEG Image",
  ".jpeg": "JPEG Image",
  ".gif": "GIF Image",
  ".svg": "SVG Image",
  ".webp": "WebP Image",
  ".ico": "Icon",
  ".mp3": "MP3 Audio",
  ".wav": "WAV Audio",
  ".ogg": "OGG Audio",
  ".mp4": "MP4 Video",
  ".mov": "QuickTime Video",
  ".avi": "AVI Video",
  ".webm": "WebM Video",
  ".zip": "ZIP Archive",
  ".rar": "RAR Archive",
  ".7z": "7-Zip Archive",
  ".tar": "TAR Archive",
  ".gz": "GZIP Archive",
  ".lock": "Lock File",
};


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
