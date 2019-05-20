// tslint:disable:no-console
import chalk from "chalk";
import commander from "commander";
import { entries, isObject } from "lodash";
import { join } from "path";
import { stdout } from "single-line-log";
import { errCount, tcpCount } from "./ajax";
import { createObserver } from "./createObserver";
import { IOptions, IResult, ISource } from "./faces";
import { writeJSON } from "./fileUtils";
import { parse } from "./parse";
const program = commander
  .description("统计局爬虫")
  .option("--depth [depth]", "搜索深度1:省,2:市,3:区,4:镇,5:办事处", "1")
  .option("--url [url]", "网址", "http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/index.html")
  .option("--delay-time [delayTime]", "每次请求间隔", "300")
  .option("--concurrent [concurrent]", "并发数量", "10")
  .option("--retry-count [retryCount]", "下载失败的时候重复请求次数", "3")
  .parse(process.argv);
main();
function main() {
  const url = program.url;
  // const url = "http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/23.html";
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
function onStart(url: string, options: IOptions) {
  console.log(chalk.yellow("Options:"));
  console.log(`  url: ${url}`);
  entries(options)
    .filter((x) => !isObject(x[1]))
    .forEach(([key, value]) => console.log(`  ${key}: ${value}`));
  console.log(chalk.cyan("Process:"));
}
function onLine({ data, index }: { data: ISource, index: number }) {
  stdout(`  index\ttcp\terr\turl\n  ${index}\t${tcpCount}\t${errCount}\t${data.url || "null"}\n`);
}
async function onComplete(data: IResult[]) {
  const filename = join(__dirname, "../build/data.json");
  await writeJSON(filename, data);
  console.log();
  console.log(chalk.green("Complete:"));
  console.log(`  output file://${filename}`);
  console.log();
}
