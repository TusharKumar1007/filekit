# FileKit

**Package:** `@tusharkumar1007/filekit`  
**CLI binary:** `filekit`  
**Repository:** [https://github.com/TusharKumar1007/filekit](https://github.com/TusharKumar1007/filekit)

FileKit is a Node.js command-line toolkit for inspecting, searching, opening, creating, copying, moving, clearing, and deleting files and directories.

---

## Prerequisites and Compatibility

- **Node.js:** `>=20` (as specified in `package.json` `engines.node`). The project uses ES Modules (`"type": "module"`) and Node.js built-in modules (`node:fs/promises`, `node:path`, `node:child_process`).
- **npm:** Needed to install the package or manage dependencies.
- **TypeScript (`tsc`):** Required only if building from source (`npm run build` runs `tsc`, and `typescript` is not listed in `package.json` `devDependencies`).
- **Platform notes for `open` and `reveal`:**
  - **Windows (`win32`):** Uses `explorer.exe`.
  - **macOS (`darwin`):** Uses `open`.
  - **Linux / other platforms:** Uses `xdg-open`.
  - Note: For files, `reveal` passes `"/select,"` as an argument alongside the resolved path (Windows Explorer syntax).

---

## Installation

### Install from npm

Install globally to use the `filekit` command anywhere:

```bash
npm install -g @tusharkumar1007/filekit
```

Or run without installing globally:

```bash
npx @tusharkumar1007/filekit --help
```

### Install from source

```bash
git clone https://github.com/TusharKumar1007/filekit.git
cd filekit
npm install
npm run build
```

> **Note:** `npm run build` executes `tsc`. Ensure TypeScript is installed in your environment (for example, `npm install -g typescript`) before building.

To link the `filekit` binary globally from your local clone:

```bash
npm link
```

Or run the compiled entry point directly:

```bash
node ./dist/main.js --help
```

---

## Usage

```bash
filekit [options] [command]
```

### Global Options and Built-in Help

| Flag / Command | Description |
| --- | --- |
| `-V`, `--version` | Output the CLI version (`0.1.5` in `src/commands/commander.ts`; `package.json` version is `1.0.0`) |
| `-h`, `--help` | Display help for the CLI or a specific command |
| `help [command]` | Display help for a specific command |

> **Command Aliases:** None of the FileKit subcommands define command aliases.

---

## CLI Commands

### 1. `info`

Displays metadata for a file or directory, including name, type (mapped from known file extensions or `"Folder"`), resolved location, creation time, last modified time, extension (for files), size, and recursive file/folder counts (for directories).

- **Syntax:** `filekit info [options] <path>`
- **Aliases:** None
- **Arguments:**
  - `<path>` *(required)* — Path to the file or directory (also supports `.` and `./`).
- **Options:**
  - `--json` — Output metadata in JSON format (`JSON.stringify(..., null, 2)`). *(Default: `false`, prints formatted key-value lines)*
  - `--kb` — Output size in KB (`2` decimal places).
  - `--mb` — Output size in MB (`2` decimal places).
  - `--gb` — Output size in GB (`2` decimal places).
- **Defaults:**
  - Output format: Human-readable key-value lines (`File Name`, `Type`, `Location`, `Created At`, `Modify At`, plus `Extension` for files or `Files`/`Folders` for directories, and `File Size`).
  - Size unit: `Bytes`. If multiple size flags are supplied, precedence is `--mb` > `--gb` > `--kb` > `Bytes`.

**Examples:**

```bash
filekit info ./package.json
filekit info ./src --mb
filekit info ./package.json --kb --json
```

---

### 2. `tree`

Recursively prints all nested files and folders under the specified directory in a tree format.

- **Syntax:** `filekit tree [options] <path>`
- **Aliases:** None
- **Arguments:**
  - `<path>` *(required)* — Folder path.
- **Options:**
  - `--full` — Show the joined path in parentheses after every file or folder name. *(Default: `false`)*

**Examples:**

```bash
filekit tree ./src
filekit tree ./src --full
```

---

### 3. `findin`

Recursively searches a directory for files matching a wildcard pattern and prints the matching directory tree (only directories containing matching files are displayed). Matching is case-insensitive.

- **Syntax:** `filekit findin [options] <path> <wildcard>`
- **Aliases:** None
- **Arguments:**
  - `<path>` *(required)* — Search folder path (must be an existing directory).
  - `<wildcard>` *(required)* — Wildcard pattern or filename:
    - `*<text>` — Matches if the full filename **or** filename without extension ends with `<text>` (e.g., `*.ts`, `*config`).
    - `?<text>` — Matches if the full filename **or** filename without extension starts with `<text>` (e.g., `?main`).
    - Any other value — Exact case-insensitive match against the full filename.
- **Options:**
  - `--full` — Show the full path in parentheses after every matched file or folder. *(Default: `false`)*

**Examples:**

```bash
filekit findin ./src "*.ts"
filekit findin ./src "?info"
filekit findin ./src "package.json" --full
```

---

### 4. `open`

Opens a file or folder with the operating system's default handler (`explorer.exe` on Windows, `open` on macOS, `xdg-open` on other platforms).

- **Syntax:** `filekit open <path>`
- **Aliases:** None
- **Arguments:**
  - `<path>` *(required)* — Path of the file or folder to open.
- **Options:** None (apart from `-h, --help`).

**Examples:**

```bash
filekit open ./package.json
filekit open ./src
```

---

### 5. `reveal`

Reveals a file in its containing folder or opens a directory using the platform file manager (`explorer.exe` on Windows, `open` on macOS, `xdg-open` on other platforms). For files, it passes `"/select,"` before the resolved file path.

- **Syntax:** `filekit reveal <path>`
- **Aliases:** None
- **Arguments:**
  - `<path>` *(required)* — Path to the file or folder to reveal.
- **Options:** None (apart from `-h, --help`).

**Examples:**

```bash
filekit reveal ./src/main.ts
filekit reveal ./src
```

---

### 6. `clear`

Removes all contents inside a directory recursively while preserving the directory itself.

- **Syntax:** `filekit clear <path>`
- **Aliases:** None
- **Arguments:**
  - `<path>` *(required)* — Path to the folder to clear.
- **Options:** None (apart from `-h, --help`).
- **Safety Behavior:**
  - Rejects empty/whitespace paths, filesystem roots, symbolic links, non-directory paths, and ancestors of the current working directory.

**Examples:**

```bash
filekit clear ./temp-output
```

---

### 7. `delete`

Permanently deletes a file or directory (recursively) at the specified path.

- **Syntax:** `filekit delete <path>`
- **Aliases:** None
- **Arguments:**
  - `<path>` *(required)* — Path to the file or folder to delete.
- **Options:** None (apart from `-h, --help`).
- **Safety Behavior:**
  - Rejects empty/whitespace paths, the current working directory, ancestors/parents of the current working directory, filesystem roots, and symbolic links.

**Examples:**

```bash
filekit delete ./old-file.txt
filekit delete ./temp-folder
```

---

### 8. `copy`

Copies a file or folder into a destination directory (`<destination path>/<source basename>`). Creates the destination directory recursively if it does not exist.

- **Syntax:** `filekit copy [options] <source path> <destination path>`
- **Aliases:** None
- **Arguments:**
  - `<source path>` *(required)* — Path of the file or folder to copy.
  - `<destination path>` *(required)* — Path to the destination folder.
- **Options:**
  - `--force` — Overwrite an already existing file or folder at the destination. *(Default: `false`; fails if target already exists)*
- **Safety Behavior:**
  - Rejects copying an ancestor of the current working directory.
  - Rejects copying a directory into itself or one of its subdirectories.

**Examples:**

```bash
filekit copy ./notes.txt ./backup
filekit copy ./assets ./dist-assets --force
```

---

### 9. `mkdir`

Creates a new directory at the given path. Its parent directory must already exist (non-recursive).

- **Syntax:** `filekit mkdir <path>`
- **Aliases:** None
- **Arguments:**
  - `<path>` *(required)* — Path to the folder to create.
- **Options:** None (apart from `-h, --help`).

**Examples:**

```bash
filekit mkdir ./logs
```

---

### 10. `touch`

Creates one or more empty files at the specified paths without overwriting existing files.

- **Syntax:** `filekit touch [options] <path...>`
- **Aliases:** None
- **Arguments:**
  - `<path...>` *(required, variadic)* — One or more file paths to create.
- **Options:**
  - `--force` — Automatically create missing parent directories before creating each file. *(Default: `false`; fails if parent directory does not exist)*

**Examples:**

```bash
filekit touch ./notes.txt
filekit touch ./a.txt ./b.txt
filekit touch ./nested/dir/app.log --force
```

---

### 11. `move`

Moves a file or folder into an existing destination directory (`<destination path>/<source basename>`).

- **Syntax:** `filekit move [options] <source path> <destination path>`
- **Aliases:** None
- **Arguments:**
  - `<source path>` *(required)* — Path to the file or folder to move.
  - `<destination path>` *(required)* — Path to an existing destination directory.
- **Options:**
  - `--force` — Overwrite an already existing file or folder at the destination (copies recursively then removes the source). *(Default: `false`; uses `fs.rename` and fails if target exists or across filesystems with `EXDEV`)*
- **Safety Behavior:**
  - Rejects non-directory destinations.
  - Rejects moving an ancestor of the current working directory.
  - Rejects moving a directory into itself or one of its subdirectories.

**Examples:**

```bash
filekit move ./draft.txt ./archive
filekit move ./build-temp ./archive --force
```

---

## Development and Build

TypeScript configuration (`tsconfig.json`) compiles sources from `./src` into `./dist` targeting `ES2022` with `NodeNext` module resolution, strict type checking, source maps, and `.d.ts` declarations.

### Available npm Scripts

| Script | Command | Description |
| --- | --- | --- |
| `npm run build` | `tsc` | Compiles TypeScript source files from `src/` to `dist/`. |
| `npm start` | `node ./dist/main.js` | Runs the compiled CLI entry point. |
| `npm run dev` | `npm run build && node ./dist/main.js` | Rebuilds and runs the CLI entry point. |
| `npm run prepack` | `npm run build` | Lifecycle script that builds `dist/` before packing. |

To run a CLI command locally during development without linking globally:

```bash
npm run build
node ./dist/main.js info ./package.json
```

---

## Links

- **GitHub Repository:** [https://github.com/TusharKumar1007/filekit](https://github.com/TusharKumar1007/filekit)
- **Bug Tracker / Issues:** [https://github.com/TusharKumar1007/filekit/issues](https://github.com/TusharKumar1007/filekit/issues)

---

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.
