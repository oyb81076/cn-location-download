import { createObserver } from "../createObserver";
import { IOptions } from "../faces";
import { parse } from "../parse";
const URL = "http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/index.html";
it("should ok", async () => {
  const options: IOptions = {
    concurrent: 1,
    delayTime: 0,
    depth: 1,
    parse,
    retryCount: 3,
  };
  const { complete$, start } = createObserver(URL, 0, options);
  process.nextTick(start);
  const array = await complete$.toPromise();
  expect(array).toMatchSnapshot(); // 这里就搞一层的
});
