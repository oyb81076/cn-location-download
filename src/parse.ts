import { load } from "cheerio";
import { resolve } from "url";
import { IData, IOptions } from "./faces";

export const parse: IOptions["parse"] = ({ depth, url }, content) => {
  if (!url) { return []; }
  switch (depth) {
    case 0: return parseRoot(url, content);
    case 1: return parseOthers(url, content);
    case 2: return parseOthers(url, content);  // 有些地方返回的就直接是 county, 有些则是 towns
    case 3: return parseOthers(url, content);
    case 4: return parseOthers(url, content);
    default: throw new Error("错误的depth参数");
  }
};

export function parseRoot(url: string, content: string): IData[] {
  const $ = load(content);
  return $(".provincetr a").toArray().map((el): IData => {
    const href = el.attribs.href;
    const code = parseInt(href.split(".")[0], 10) * 100000000;
    const name = $(el).text();
    const link = resolve(url, href);
    return { name, url: link, code };
  });
}

export function parseOthers(url: string, content: string): IData[] {
  const $ = load(content);
  return $(".citytr,.countytr,.towntr,.villagetr").toArray().map((tr) => {
    const $tr = $(tr);
    const $children = $tr.children();
    const href = $tr.find("a").attr("href");
    const code = parseInt($children.first().text(), 10);
    const name = $children.last().text();
    if (href) {
      return { name, code, url: resolve(url, href) };
    } else {
      return { name, code };
    }
  });
}
