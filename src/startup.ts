import { readFile } from "fs-extra";
import stringify from "json-stringify-pretty-compact";
import { join } from "path";
import { empty, from, Observable, of } from "rxjs";
import { delay, expand, filter, map, mapTo, mergeMap, publish, refCount, retry, toArray } from "rxjs/operators";
import log from "single-line-log";
import { IOptions, ISource } from "./faces";
import { existsFile, urlToFilename, write } from "./fileUtils";
import { requestURL, tcpCount } from "./requestURL";
import { serialize } from "./serialize";

export function start(url: string, depth: number, opts: IOptions) {
  const source: ISource = { url, depth };
  const $ob = of(source)
    .pipe(expand((src: ISource) => makeTask(src, opts), opts.concurrent))
    .pipe(publish(), refCount());
  $ob.pipe(map((data, index) => ({ data, index })))
    .subscribe(({ data, index }) => {
      log.stdout(`[index:${index}] [tcp:${tcpCount}] [url:${data.url}]\n`);
    });
  $ob
    .pipe(filter((x) => x.depth === depth + 1))
    .pipe(toArray())
    .pipe(map(serialize))
    .subscribe((nodes) => {
      const content = stringify(nodes);
      write(join(__dirname, "../temp/data.json"), content);
    });
}
function makeAjax(url: string, filename: string, retryCount: number, delayTime: number): Observable<string> {
  return of(1)
    .pipe(mergeMap(() => requestURL(url)))
    .pipe(delay(delayTime))
    .pipe(retry(retryCount))
    .pipe(mergeMap((content) => from(write(filename, content)).pipe(mapTo(content))));
}
function makeReadFile(filename: string): Observable<string> {
  return from(readFile(filename, { encoding: "utf8" }));
}
function makeTask(source: ISource, { retryCount, parse, depth, delayTime }: IOptions): Observable<ISource> {
  const { url } = source;
  if (!url || source.depth === depth) { return empty(); }
  const filename = urlToFilename(url);
  return from(existsFile(filename))
    .pipe(mergeMap((exists) => exists ? makeReadFile(filename) : makeAjax(url, filename, retryCount, delayTime)))
    .pipe(mergeMap((content): Observable<ISource> => {
      const dataArray = parse(source, content);
      const children = source.children = dataArray.map((x): ISource => {
        return { url: x.url, depth: source.depth + 1, data: x };
      });
      return from(children);
    }));
}
