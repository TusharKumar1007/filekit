declare global {
  type FilePath = string;
  interface FileDetails {
    file_name: string;
    extension: string;
    file_size: string;
    created_at: string;
    modify_at: string;
    Type: `${string} File` | "Folder";
    [key: string]: string;
  }
  type WildCard = `*.${string}` | `?${string}`;

  type Info = {
    Directory_Size: number;
    Num_File: number;
    Num_Folders: number;
  };

  type ExtentionType = keyof typeof fileExtensions;
}

export const fileExtensions = {
  // JavaScript / TypeScript
  ".js": "JavaScript",
  ".mjs": "JavaScript",
  ".cjs": "JavaScript",
  ".jsx": "JavaScript React",
  ".ts": "TypeScript",
  ".tsx": "TypeScript React",

  // Web Development
  ".html": "HTML",
  ".htm": "HTML",
  ".css": "CSS",
  ".scss": "SCSS",
  ".sass": "Sass",
  ".less": "Less",
  ".vue": "Vue",
  ".svelte": "Svelte",
  ".astro": "Astro",

  // Data / Configuration
  ".json": "JSON",
  ".xml": "XML",
  ".yaml": "YAML",
  ".yml": "YAML",
  ".toml": "TOML",
  ".ini": "INI",
  ".env": "Environment File",
  ".cfg": "Configuration File",
  ".conf": "Configuration File",
  ".config": "Configuration File",
  ".lock": "Lock File",
  ".log": "Log File",

  // Text / Documentation
  ".md": "Markdown",
  ".mdx": "MDX",
  ".txt": "Plain Text",
  ".rtf": "Rich Text Format",
  ".rst": "reStructuredText",
  ".tex": "LaTeX",

  // Programming Languages
  ".py": "Python",
  ".pyw": "Python",
  ".pyc": "Python Bytecode",
  ".ipynb": "Jupyter Notebook",
  ".java": "Java",
  ".class": "Java",
  ".jar": "Java Archive",
  ".c": "C",
  ".h": "C Header",
  ".cpp": "C++",
  ".cc": "C++",
  ".cxx": "C++",
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
  ".scala": "Scala",
  ".pl": "Perl",
  ".ex": "Elixir",
  ".exs": "Elixir Script",
  ".hs": "Haskell",
  ".sh": "Shell Script",
  ".bash": "Bash",
  ".zsh": "Zsh",
  ".ps1": "PowerShell",
  ".bat": "Batch File",
  ".cmd": "Command Script",

  // Frameworks / API
  ".graphql": "GraphQL",
  ".gql": "GraphQL",
  ".proto": "Protocol Buffers",
  ".prisma": "Prisma Schema",
  ".dockerfile": "Dockerfile",

  // Office Documents
  ".pdf": "PDF",
  ".doc": "Word Document",
  ".docx": "Word Document",
  ".docm": "Word Macro-enabled Document",
  ".odt": "OpenDocument Text",
  ".xls": "Excel Spreadsheet",
  ".xlsx": "Excel Spreadsheet",
  ".xlsm": "Excel Macro-enabled Spreadsheet",
  ".xlsb": "Excel Binary Workbook",
  ".ods": "OpenDocument Spreadsheet",
  ".ppt": "PowerPoint",
  ".pptx": "PowerPoint",
  ".pptm": "PowerPoint Macro-enabled Presentation",
  ".pps": "PowerPoint Slideshow",
  ".ppsx": "PowerPoint Slideshow",
  ".odp": "OpenDocument Presentation",
  ".csv": "CSV",
  ".tsv": "TSV",

  // Images
  ".png": "PNG Image",
  ".jpg": "JPEG Image",
  ".jpeg": "JPEG Image",
  ".gif": "GIF Image",
  ".svg": "SVG Image",
  ".webp": "WebP Image",
  ".avif": "AVIF Image",
  ".ico": "Icon",
  ".bmp": "Bitmap Image",
  ".tif": "TIFF Image",
  ".tiff": "TIFF Image",
  ".heic": "HEIC Image",
  ".heif": "HEIF Image",
  ".psd": "Photoshop Document",
  ".ai": "Adobe Illustrator",
  ".eps": "Encapsulated PostScript",
  ".raw": "RAW Image",
  ".dng": "Digital Negative",

  // Audio
  ".mp3": "MP3 Audio",
  ".wav": "WAV Audio",
  ".ogg": "OGG Audio",
  ".opus": "Opus Audio",
  ".flac": "FLAC Audio",
  ".aac": "AAC Audio",
  ".m4a": "M4A Audio",
  ".wma": "Windows Media Audio",
  ".aiff": "AIFF Audio",
  ".aif": "AIFF Audio",
  ".mid": "MIDI Audio",
  ".midi": "MIDI Audio",
  ".amr": "AMR Audio",
  ".ape": "Monkey's Audio",

  // Video
  ".mp4": "MP4 Video",
  ".mkv": "Matroska Video",
  ".mov": "QuickTime Video",
  ".avi": "AVI Video",
  ".webm": "WebM Video",
  ".wmv": "Windows Media Video",
  ".flv": "Flash Video",
  ".mpeg": "MPEG Video",
  ".mpg": "MPEG Video",
  ".m4v": "M4V Video",
  ".3gp": "3GPP Video",
  ".3g2": "3GPP2 Video",
  ".mts": "AVCHD Video",
  ".m2ts": "Blu-ray Video",
  ".vob": "DVD Video",
  ".ogv": "Ogg Video",
  ".mxf": "Material Exchange Format",
  ".hevc": "HEVC Video",
  ".h264": "H.264 Video",
  ".h265": "H.265 Video",

  // Subtitles
  ".srt": "SubRip Subtitle",
  ".vtt": "WebVTT Subtitle",
  ".ass": "Advanced SubStation Alpha Subtitle",
  ".ssa": "SubStation Alpha Subtitle",
  ".sub": "Subtitle File",
  ".lrc": "Lyrics File",

  // Archives / Compressed Files
  ".zip": "ZIP Archive",
  ".rar": "RAR Archive",
  ".7z": "7-Zip Archive",
  ".tar": "TAR Archive",
  ".gz": "GZIP Archive",
  ".tgz": "Compressed TAR Archive",
  ".bz2": "BZIP2 Archive",
  ".xz": "XZ Archive",
  ".zst": "Zstandard Archive",
  ".cab": "Windows Cabinet Archive",
  ".iso": "Disk Image",
  ".dmg": "Apple Disk Image",
  ".img": "Disk Image",

  // Executables / Applications
  ".exe": "Windows Executable",
  ".msi": "Windows Installer",
  ".dll": "Dynamic Link Library",
  ".sys": "Windows System File",
  ".app": "macOS Application",
  ".deb": "Debian Package",
  ".rpm": "RPM Package",
  ".apk": "Android Package",
  ".aab": "Android App Bundle",
  ".ipa": "iOS Application Archive",
  ".appx": "Windows App Package",
  ".msix": "Windows App Package",
  ".so": "Shared Object Library",
  ".dylib": "macOS Dynamic Library",
  ".bin": "Binary File",

  // Fonts
  ".ttf": "TrueType Font",
  ".otf": "OpenType Font",
  ".woff": "Web Open Font Format",
  ".woff2": "Web Open Font Format 2",
  ".eot": "Embedded OpenType Font",

  // Database
  ".db": "Database File",
  ".sqlite": "SQLite Database",
  ".sqlite3": "SQLite Database",
  ".mdb": "Microsoft Access Database",
  ".accdb": "Microsoft Access Database",
  ".dump": "Database Dump",
  ".bson": "BSON",
  ".parquet": "Apache Parquet",

  // 3D / Design
  ".obj": "3D Object",
  ".fbx": "3D Model",
  ".stl": "3D Model",
  ".gltf": "GL Transmission Format",
  ".glb": "Binary GL Transmission Format",
  ".blend": "Blender Project",
  ".dae": "COLLADA 3D",
  ".3ds": "3D Studio Model",
  ".dwg": "AutoCAD Drawing",
  ".dxf": "Drawing Exchange Format",
  ".step": "STEP CAD Model",
  ".stp": "STEP CAD Model",

  // Game Development
  ".unity": "Unity Scene",
  ".unitypackage": "Unity Package",
  ".uasset": "Unreal Engine Asset",
  ".umap": "Unreal Engine Map",
  ".godot": "Godot Project",
  ".tscn": "Godot Scene",
  ".tres": "Godot Resource",
  ".gd": "GDScript",

  // Machine Learning
  ".onnx": "ONNX Model",
  ".pt": "PyTorch Model",
  ".pth": "PyTorch Model",
  ".pkl": "Python Pickle",
  ".safetensors": "SafeTensors Model",
  ".gguf": "GGUF Model",
  ".h5": "HDF5 File",
  ".keras": "Keras Model",
  ".tflite": "TensorFlow Lite Model",

  // Certificates / Keys
  ".pem": "PEM Certificate",
  ".crt": "Certificate",
  ".cer": "Certificate",
  ".der": "DER Certificate",
  ".p12": "PKCS#12 Certificate",
  ".pfx": "Personal Information Exchange",
  ".key": "Private Key",
  ".pub": "Public Key",
  ".gpg": "GPG Encrypted File",
  ".pgp": "PGP Encrypted File",

  // Email / Calendar / Contacts
  ".eml": "Email Message",
  ".msg": "Outlook Email Message",
  ".mbox": "Mailbox File",
  ".ics": "Calendar File",
  ".vcf": "vCard Contact",

  // Other Common Files
  ".torrent": "BitTorrent File",
  ".patch": "Patch File",
  ".diff": "Diff File",
  ".bak": "Backup File",
  ".tmp": "Temporary File",
  ".temp": "Temporary File",
  ".swp": "Swap File",
  ".manifest": "Manifest File",
  ".checksum": "Checksum File",
  ".sha256": "SHA-256 Checksum",
  ".md5": "MD5 Checksum",
  ".url": "Internet Shortcut",
  ".lnk": "Windows Shortcut",
  ".reg": "Windows Registry File",
  ".plist": "Property List",
  ".crx": "Chrome Extension",
  ".xpi": "Firefox Extension",
  ".vsix": "Visual Studio Extension",
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
