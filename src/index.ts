// tslint:disable:no-console
import commander from "commander";
import { start } from "./download";
const program = commander
  .description("统计局爬虫")
  .option("-d, --depth [depth]", "搜索深度1:省,2:市,3:区,4:镇,5:办事处", "1")
  .option("-u, --url [url]", "网址", "http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2017/index.html")
  .parse(process.argv);
start({
  depth: parseInt(program.depth, 10),
  url: program.url,
}).catch((e) => console.error(e));
