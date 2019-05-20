import { decode } from "iconv-lite";
import { get } from "request";
export let tcpCount = 0;
export let errCount = 0;
const errors: Record<string, number> = {};
const headers = {
  // tslint:disable-next-line:max-line-length
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
  "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
  "cache-control": "no-cache",
  "pragma": "no-cache",
  "upgrade-insecure-requests": "1",
};
export async function ajax(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    tcpCount++;
    get(url, { encoding: null, timeout: 10000, headers }, (err, res, data) => {
      tcpCount--;
      if (err) {
        errCount++;
        const count = errors[url] = (errors[url] || 0) + 1;
        console.log();
        console.error("请求链接失败, 失败次数%i: %s", count, url);
        console.log();
        reject(new Error(err));
      } else if (res.statusCode < 200 || res.statusCode >= 300) {
        const text = decode(data, "gb2312").toString();
        reject(text);
      } else {
        const text = decode(data, "gb2312").toString();
        resolve(text);
      }
    });
  });
}
