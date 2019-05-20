import { decode } from "iconv-lite";
import { get } from "request";
export let tcpCount = 0;
export let errCount = 0;
const errors: Record<string, number> = {};
export async function ajax(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    tcpCount++;
    get(url, { encoding: null, timeout: 10000 }, (err, res, data) => {
      tcpCount--;
      if (err) {
        errCount++;
        const count = errors[url] = (errors[url] || 0) + 1;
        console.error("请求链接失败, 失败次数%i: %s", count, url);
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
