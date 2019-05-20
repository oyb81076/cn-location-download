// tslint:disable:max-line-length
// tslint:disable:object-literal-sort-keys
import { decode } from "iconv-lite";
import * as request from "request";
export let tcpCount = 0;
export let errCount = 0;
const j = request.jar();
// request.defaults({ jar: j });
// const cookieString = "_trs_uv=jp9xer8z_6_aqi7; AD_RS_COOKIE=20082854; __utma=207252561.173911821.1558337450.1558337450.1558337450.1; __utmc=207252561; __utmz=207252561.1558337450.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmb=207252561.4.10.1558337450; wzws_cid=ae5b9ec44c6145530e81a7297235133e5accc1f1e6caca8a64bc25ea843ebaf5e6a4ce48fa9fe5d92c06efe6401e81ee5188f1680acf09a13e007f85d97a8d5e";
// const cookie = request.cookie(cookieString)!;
// j.setCookie(cookie, "http://www.stats.gov.cn");

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
    request.get(url, { encoding: null, timeout: 10000, headers, jar: j }, (err, res, data) => {
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
