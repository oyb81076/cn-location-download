import { readFile } from "fs-extra";
import { from, Observable, of, Subject } from "rxjs";
import { delay, last, map, mapTo, mergeMap, publish, refCount, retry, tap } from "rxjs/operators";
import { ajax } from "./ajax";
import { IOptions, IResult, ISource } from "./faces";
import { existsFile, urlToFilename, write } from "./fileUtils";
import { serialize } from "./serialize";
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

function processOne(
  subject$: SourceSubject,
  source: ISource,
  opts: IOptions,
): Observable<ISource> {
  const { url } = source;
  const { retryCount, depth, delayTime } = opts;
  if (!url || source.depth >= depth) { return of(source); }
  const filename = urlToFilename(url);
  return from(existsFile(filename))
    .pipe(mergeMap((exists) => exists ? fromFile(filename) : fromAjax(url, filename, retryCount, delayTime)))
    .pipe(tap((content) => parseSource(source, content, opts))) // 将 setChildrenByContent
    .pipe(tap(() => publishNextSources(source, subject$, opts))) // publishSourceByChildren
    .pipe(tap(subject$.completeOne)) // completeOne
    .pipe(mergeMap(() => mapSource(source, opts)));
}

function parseSource(source: ISource, content: string, { parse }: IOptions) {
  const dataArray = parse(source, content);
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

function fromAjax(url: string, filename: string, retryCount: number, delayTime: number): Observable<string> {
  return of(1)
    .pipe(mergeMap(() => ajax(url)))
    .pipe(delay(delayTime))
    .pipe(retry(retryCount))
    .pipe(mergeMap((content) => from(write(filename, content)).pipe(mapTo(content))));
}

function fromFile(filename: string): Observable<string> {
  return from(readFile(filename, { encoding: "utf8" }));
}
