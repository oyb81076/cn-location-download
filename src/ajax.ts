// tslint:disable:max-line-length
// tslint:disable:object-literal-sort-keys
import { decode } from "iconv-lite";
import { get } from "request";
export let tcpCount = 0;
export let errCount = 0;
const headers = {
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
  "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
  "cache-control": "max-age=0",
  "if-modified-since": "Thu, 31 Jan 2019 05:42:54 GMT",
  "upgrade-insecure-requests": "1",
  "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",
};

export async function ajax(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    tcpCount++;
    get(url, { encoding: null, timeout: 10000, headers }, (err, res, data) => {
      tcpCount--;
      if (err) {
        errCount++;
        reject(new Error(`文件${url}下载失败`));
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
