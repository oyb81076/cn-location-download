import { readFile } from "fs-extra";
import { from, Observable, of, Subject } from "rxjs";
import { delay, last, map, mapTo, mergeMap, publish, refCount, retry, tap } from "rxjs/operators";
import { ajax } from "./ajax";
import { IOptions, IResult, ISource } from "./faces";
import { existsFile, renameToErrorSync, urlToFilename, write } from "./fileUtils";
import { serialize } from "./serialize";
export let fromAjaxCount = 0;
export let fromFileCount = 0;
class SourceSubject {
  public source$ = new Subject<ISource>();
  private count = 0;
  public completeOne = () => {
    --this.count;
    if (this.count === 0) {
      this.source$.complete();
    }
  }
  public nextOne = (source: ISource) => {
    ++this.count;
    this.source$.next(source);
  }
}
interface IObserve {
  output$: Observable<{ data: ISource, index: number }>; // 输出流 (每一行的输出)
  complete$: Observable<IResult[] | any>; // 完成的流
  start(): void;
}
export function createObserver(url: string, depth: number, opts: IOptions): IObserve  {
  const source: ISource = { url, depth };
  const sourceSubject = new SourceSubject();
  const subject$ = sourceSubject.source$
    .pipe(mergeMap((src) => processOne(sourceSubject, src, opts), opts.concurrent))
    .pipe(publish(), refCount());
  const output$ = subject$.pipe(map((data, index) => ({ data, index })));
  const complete$ = subject$
    .pipe(last())
    .pipe(map(() => serialize(source.children!)));
  function start() {
    sourceSubject.nextOne(source);
  }
  return { output$, complete$, start };
}

function processOne(subject$: SourceSubject, source: ISource, opts: IOptions): Observable<ISource> {
  const { url } = source;
  if (!url || source.depth >= opts.depth) { return of(source); }
  const filename = urlToFilename(url);
  return from(existsFile(filename))
    .pipe(tap((v) => v ? fromFileCount++ : fromAjaxCount++))
    .pipe(mergeMap((exists) => exists ? fromFile(filename) : fromAjax(url, filename, opts)))
    .pipe(tap((content) => parseSource(source, content, filename, url, opts))) // 将 setChildrenByContent
    .pipe(tap(() => publishNextSources(source, subject$, opts))) // publishSourceByChildren
    .pipe(tap(subject$.completeOne)) // completeOne
    .pipe(mergeMap(() => mapSource(source, opts)));
}

function parseSource(source: ISource, content: string, filename: string, url: string, { parse }: IOptions) {
  const dataArray = parse(source, content);
  if (dataArray.length === 0) {
    const errorFilename = renameToErrorSync(filename, url);
    throw new Error(`url: ${source.url} 转换失败, 未能发现数据, file://${errorFilename}`);
  } else if (dataArray.find((x) => isNaN(x.code))) {
    const errorFilename = renameToErrorSync(filename, url);
    throw new Error(`url: ${source.url} 转换错误, 存在 code 为NaN, file://${errorFilename}`);
  } else if (dataArray.find((x) => !x.name || /^\d+$/.test(x.name))) {
    const errorFilename = renameToErrorSync(filename, url);
    throw new Error(`url: ${source.url} 转换错误, 存在 name 为空或者是纯数字, file://${errorFilename}`);
  }
  source.children = dataArray.map((x): ISource => {
    return { url: x.url, depth: source.depth + 1, data: x };
  });
}

function mapSource(source: ISource, { depth }: IOptions): Observable<ISource> {
  const sources = [source].concat(...source.children!.filter((x) => x.depth >= depth || !x.depth));
  return from(sources);
}

function publishNextSources({ children }: ISource, subject: SourceSubject, { depth }: IOptions) {
  children!.filter((x) => x.depth < depth && x.url).forEach(subject.nextOne);
}

function fromAjax(url: string, filename: string, { timeout, delayTime, retryCount }: IOptions): Observable<string> {
  return of(1)
    .pipe(mergeMap(() => ajax(url, timeout)))
    .pipe(delay(delayTime))
    .pipe(retry(retryCount))
    .pipe(mergeMap((content) => fromWriteContent(filename, content)));
}

function fromWriteContent(filename: string, content: string): Observable<string> {
  return from(write(filename, content)).pipe(mapTo(content));
}

function fromFile(filename: string): Observable<string> {
  return from(readFile(filename, { encoding: "utf8" }));
}
