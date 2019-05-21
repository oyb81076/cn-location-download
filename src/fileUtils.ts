import { existsSync, mkdirs, mkdirsSync, pathExists, removeSync, renameSync, writeFile } from "fs-extra";
import stringify from "json-stringify-pretty-compact";
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

export async function writeJSON(filename: string, data: any) {
  const content = stringify(data);
  await write(join(filename), content);
}

export function renameToErrorSync(filename: string, url: string) {
  const nextFilename = join(__dirname, "../temp/error", new URL(url).pathname);
  filename.replace(/\.html$/, ".error.html");
  if (existsSync(nextFilename)) {
    removeSync(nextFilename);
    renameSync(filename, nextFilename);
  } else {
    const dirs = fileDir(nextFilename);
    mkdirsSync(dirs);
    renameSync(filename, nextFilename);
  }
  return nextFilename;
}
