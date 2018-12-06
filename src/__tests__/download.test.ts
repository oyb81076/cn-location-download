import { download } from "../download";

test("depth=1", async () => {
  const data = await download("http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2017/index.html", 0, 1, false);
  expect(data).toMatchSnapshot();
});
