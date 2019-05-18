import { load } from "cheerio";
import { decode } from "iconv-lite";
import { get } from "request";
import { resolve } from "url";
export async function loadProvinces(url: string) {
  const $ = await getPage(url);
  const arr: Array<{ name: string, code: number, link: string }> = [];
  $(".provincetr a").each((_, el) => {
    const href = el.attribs.href;
    const code = parseInt(href.split(".")[0], 10) * 100000000;
    const name = $(el).text();
    const link = resolve(url, href);
    arr.push({ name, link, code });
  });
  return arr;
}
export async function loadCities(url: string) {
  return parseBasicPage(url, ".citytr");
}

export function loadCounties(url: string) {
  return parseBasicPage(url, ".countytr");
}
export function loadTowns(url: string) {
  return parseBasicPage(url, ".towntr");
}
export async function loadVillages(url: string) {
  const $ = await getPage(url);
  const arr: Array<{ name: string, code: number }> = [];
  $(".villagetr").each((_, tr) => {
    const codeString = $(tr).children().first().text();
    const code = parseInt(codeString, 10);
    const name = $(tr).children().last().text();
    arr.push({ name, code });
  });
  return arr;
}
export async function parseBasicPage(url: string, selector: string) {
  const $ = await getPage(url);
  const arr: Array<{ name: string, code: number, link?: string }> = [];
  $(selector).each((_, tr) => {
    const $a = $(tr).find("a");
    if ($a.length === 0) {
      const children = tr.childNodes;
      const name = $(children[0]).text();
      const code = parseInt($(children[1]).text(), 10);
      arr.push({ name, code });
    } else {
      const codeString = $(tr).children().first().find("a").text();
      const code = parseInt(codeString, 10);
      const a = $(tr).children().last().find("a");
      const href = a.attr("href");
      const name = a.text();
      const link = resolve(url, href);
      arr.push({ name, link, code });
    }
  });
  return arr;
}
export async function getPage(url: string): Promise<CheerioStatic> {
  return new Promise<CheerioStatic>((r, reject) => {
    get(url, { encoding: null }, (err, res, data) => {
      if (err) {
        reject(err);
      } else if ( res.statusCode < 200 || res.statusCode >= 300 ) {
        const text = decode(data, "gb2312").toString();
        reject(text);
      } else {
        const text = decode(data, "gb2312").toString();
        r(load(text));
      }
    });
  });
}
