import { load } from "cheerio";
import { resolve } from "url";
import { IData, IOptions } from "./faces";

export const parse: IOptions["parse"] = ({ depth, url }, content) => {
  if (!url) { return []; }
  switch (depth) {
    case 0: return getProvinces(url, content);
    case 1: return getCities(url, content);
    case 2: return getCounties(url, content);
    case 3: return getTowns(url, content);
    case 4: return getVillages(content);
    default: throw new Error("错误的depth参数");
  }
};

export function getProvinces(url: string, content: string): IData[] {
  const $ = load(content);
  return $(".provincetr a").toArray().map((el): IData => {
    const href = el.attribs.href;
    const code = parseInt(href.split(".")[0], 10) * 100000000;
    const name = $(el).text();
    const link = resolve(url, href);
    return { name, url: link, code };
  });
}
export function getCities(url: string, content: string): IData[] {
  return parseBasicPage(url, content, ".citytr");
}

export function getCounties(url: string, content: string): IData[] {
  return parseBasicPage(url, content, ".countytr");
}

export function getTowns(url: string, content: string): IData[] {
  return parseBasicPage(url, content, ".towntr");
}
export function getVillages(content: string): IData[] {
  const $ = load(content);
  return $(".villagetr").toArray().map((tr) => {
    const code = parseInt($(tr.children[0]).text().trim(), 10);
    const name = $(tr.children[2]).text();
    return { name, code };
  });
}
export function parseBasicPage(url: string, content: string, selector: string): IData[] {
  const $ = load(content);
  return $(selector).toArray().map((tr) => {
    const $a = $(tr).find("a");
    if ($a.length === 0) {
      const children = tr.childNodes;
      const name = $(children[0]).text();
      const code = parseInt($(children[1]).text(), 10);
      return { name, code };
    } else {
      const codeString = $(tr).children().first().find("a").text();
      const code = parseInt(codeString, 10);
      const a = $(tr).children().last().find("a");
      const href = a.attr("href");
      const name = a.text();
      const link = resolve(url, href);
      return { name, url: link, code };
    }
  });
}