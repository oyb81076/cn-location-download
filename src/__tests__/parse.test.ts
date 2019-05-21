import { readFileSync } from "fs";
import { join } from "path";
import { parseOthers } from "../parse";

test("442000106", () => {
  const HTML = readFileSync(join(__dirname, "./442000106.html"), { encoding: "utf8" });
  const URL = "http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/44/20/442000106.html";
  expect(parseOthers(URL, HTML)).toMatchSnapshot();
});
