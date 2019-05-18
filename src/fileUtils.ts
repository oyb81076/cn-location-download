import { mkdirs, pathExists, writeFile } from "fs-extra";
import { dirname, join } from "path";
export const existsFile = pathExists;
export function urlToFilename(url: string) {
  return join(__dirname, "../temp", new URL(url).pathname);
}

export function fileDir(filename: string) {
  return dirname(filename);
}

export async function write(filename: string, content: string): Promise<string> {
  const dirs = fileDir(filename);
  await mkdirs(dirs);
  await writeFile(filename, content, { encoding: "utf8" });
  return content;
}
