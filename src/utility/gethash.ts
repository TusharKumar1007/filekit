import Path from "node:path";
import crypto from "node:crypto";
import fs from "node:fs";

export async function getHash(path: string) {
  const full_path = Path.resolve(path);
  const hash = crypto.createHash("sha256");
  const stream = fs.createReadStream(full_path);

  for await (const chunk of stream) {
    hash.update(chunk);
  }
  return hash.digest("hex");
}
