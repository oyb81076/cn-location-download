import { loadCities, loadCounties, loadProvinces, loadTowns, loadVillages } from "./loader";
export interface IEntity {
  code: number;
  name: string;
  children?: IEntity[];
}
const loaders: Array<(url: string) => Promise<Array<{ code: number, name: string, link?: string }>>> = [
  loadProvinces, loadCities, loadCounties, loadTowns, loadVillages,
];

export async function download(url: string, index: number, depth: number, log = true): Promise<IEntity[]> {
  if (log) {
    console.log(`%s %s %s`, index, depth, url);
  }
  const data = await loaders[index](url);
  if (index < depth - 1) {
    const arr: IEntity[] = [];
    for (const { code, name, link } of data) {
      if (link) {
        arr.push({ code, name, children: await download(link, index + 1, depth) });
      } else {
        arr.push({ code, name });
      }
    }
    return arr;
  } else {
    return data.map(({ name, code }) => ({ name, code }));
  }
}
