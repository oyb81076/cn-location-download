export interface IResult {
  name: string;
  code: number;
  children?: IResult[];
}
export interface ISource {
  url?: string;
  depth: number;
  data?: IData;
  children?: ISource[];
}
export interface IData {
  name: string;
  code: number;
  url?: string;
}
export interface IOptions {
  concurrent: number;
  retryCount: number;
  delayTime: number; // 请求延迟
  depth: number;
  parse: (source: ISource, content: string) => IData[];
}
