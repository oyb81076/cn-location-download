import { IOptions } from "./faces";
import { parse } from "./parse";
import { start } from "./startup";
const URL = "http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/index.html";

const options: IOptions = {
  concurrent: 10,
  delayTime: 1000,
  depth: 5,
  parse,
  retryCount: 3,
};
start(URL, 0, options);
