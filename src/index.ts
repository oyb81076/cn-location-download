// tslint:disable:no-console
import chalk from "chalk";
import commander from "commander";
import { join } from "path";
import { stdout } from "single-line-log";
import { errCount, tcpCount } from "./ajax";
import { createObserver, fromAjaxCount, fromFileCount } from "./createObserver";
import { IOptions, IResult, ISource } from "./faces";
import { writeJSON } from "./fileUtils";
import { parse } from "./parse";
const program = commander
  .description("统计局爬虫")
  .option("--depth [depth]", "搜索深度1:省,2:市,3:区,4:镇,5:办事处", "1")
  .option("--url [url]", "网址", "http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/index.html")
  .option("--delay-time [delayTime]", "每次请求间隔", "1000")
  .option("--concurrent [concurrent]", "并发数量", "4")
  .option("--retry-count [retryCount]", "下载失败的时候重复请求次数", "3")
  .parse(process.argv);
main();
function main() {
  const url = program.url;
  const depth = parseInt(program.depth, 10);
  const delayTime = parseInt(program.delayTime, 10);
  const concurrent = parseInt(program.concurrent, 10);
  const retryCount = parseInt(program.retryCount, 10);
  const options: IOptions = { concurrent, delayTime, depth, parse, retryCount };
  onStart(url, options);
  const { output$, complete$, start } = createObserver(url, 0, options);
  output$.subscribe(onLine);
  complete$.subscribe(onComplete);
  start();
}
function onStart(url: string, { concurrent, delayTime, depth, retryCount }: IOptions) {
  const out = [
    ["url       ", url],
    ["concurrent", concurrent],
    ["delayTime ", delayTime],
    ["depth     ", depth],
    ["retryCount", retryCount],
  ];
  console.log(out.reduce((a, b) => {
    return a + "  " + b[0] + " : " + b[1] + "\n";
  }, chalk.yellow("Options:")) + "\n");
}
function onLine({ data: { data }, index }: { data: ISource, index: number }) {
  const out = [
    ["rows    ", index], // 总数
    ["name    ", data && data.name || ""], // 当前的地区名称
    ["fromAjax", fromAjaxCount], // ajax请求数
    ["fromFile", fromFileCount], // 本地缓存数
    ["tcp     ", tcpCount],      // 当前的tcp请求数量
    ["errCount", errCount],      // errCount
  ];
  stdout(out.reduce((a, b) => {
    return a + "  " + b[0] + " : " + b[1] + "\n";
  }, chalk.cyan("Process:") + "\n"));
}
async function onComplete(data: IResult[]) {
  const filename = join(__dirname, "../build/data.json");
  await writeJSON(filename, data);
  console.log();
  console.log(chalk.green("Complete:"));
  console.log(`  output file://${filename}`);
  console.log();
}
