import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { loadCities, loadCounties, loadProvinces, loadTowns, loadVillages } from "./loader";
interface IEntity {
  code: number;
  name: string;
  children?: IEntity[];
}
const loaders: Array<(url: string) => Promise<Array<{ code: number, name: string, link?: string }>>> = [
  loadProvinces, loadCities, loadCounties, loadTowns, loadVillages,
];

export async function start({ depth, url }: { depth: number, url: string }) {
  const data = await load(url, 0, depth);
  console.log("加载完毕");
  if (!existsSync(join(__dirname, "../build"))) {
    mkdirSync(join(__dirname, "../build"));
  }
  writeFileSync(join(__dirname, "../build/data.json"), JSON.stringify(data, null, 2));
}
async function load(url: string, index: number, depth: number): Promise<IEntity[]> {
  console.log(`%s %s %s`, index, depth, url);
  const data = await loaders[index](url);
  if (index < depth - 1) {
    const arr: IEntity[] = [];
    for (const { code, name, link } of data) {
      if (link) {
        arr.push({ code, name, children: await load(link, index + 1, depth) });
      } else {
        arr.push({ code, name });
      }
    }
    return arr;
  } else {
    return data.map(({ name, code }) => ({ name, code }));
  }
}
