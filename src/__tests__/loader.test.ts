import { loadCities, loadCounties, loadProvinces, loadTowns, loadVillages } from "../loader";

test("provinces", async () => {
  const data = await loadProvinces("http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2017/index.html");
  expect(data).toMatchSnapshot();
});

test("cities", async () => {
  const data = await loadCities("http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2017/13.html");
  expect(data).toMatchSnapshot();
});
test("county", async () => {
  const data = await loadCounties("http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2017/14/1407.html");
  expect(data).toMatchSnapshot();
});
test("town", async () => {
  const data = await loadTowns("http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2017/14/07/140725.html");
  expect(data).toMatchSnapshot();
});
test("vellages", async () => {
  const data = await loadVillages("http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2017/14/07/25/140725200.html");
  expect(data).toMatchSnapshot();
});
