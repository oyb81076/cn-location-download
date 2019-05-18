// tslint:disable:no-console
import commander from "commander";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { download } from "./download";
const program = commander
  .description("统计局爬虫")
  .option("-d, --depth [depth]", "搜索深度1:省,2:市,3:区,4:镇,5:办事处", "1")
  .option("-u, --url [url]", "网址", "http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/index.html")
  .parse(process.argv);
const main = async () => {
  const depth = parseInt(program.depth, 10);
  const url = program.url;
  const index = 0;
  const data = await download(url, index, depth);
  console.log("加载完毕");
  if (!existsSync(join(__dirname, "../dist"))) {
    mkdirSync(join(__dirname, "../dist"));
  }
  const dest = join(__dirname, "../dist/data.json");
  writeFileSync(dest, JSON.stringify(data, null, 2));
  console.log("文件已经成功写入到 " + dest);
};
main().catch((e) => console.error(e));
